import {ScoreCriteria2,Departments,MapRankToLevel1,MapRankToLevel2, Letters} from 'src/lib/Constants'
import {handleDataInTd,filterArrByItemKeyValue} from 'src/config/units'
import _ from 'lodash'
import CommonAPI from './CommonAPI'


const unitForceTime=(tableData)=>{
    if(!tableData.unitForceTime)return;
    return +handleDataInTd(tableData,'unitForceTime','timeReq','hoursPerDay')
};
const stepTrainTime=(tableData)=>{
    if(!tableData.unitForceTime)return;
    const timeObj = handleDataInTd(tableData,'unitForceTime','timeReq');
    return `
                    年度军事训练${timeObj.months}个月不少于${timeObj.days}天${timeObj.hours}小时（每月训练不少于${timeObj.daysPerMonth}天，每天训练${timeObj.hoursPerDay}小时）；训练机动时间${timeObj.flexibleDays}天${timeObj.flexibleDays*(+timeObj.hoursPerDay)}小时；
                    夜间训练时间不少于年度训练时间的20%（216小时）；全年体能训练时间不少于280小时（不计入训练时间）
                `
};
const handleExportStr=(str)=>{
    if(!str)return;
    return str.replace(/\n/g,'').replace(/\s/g,'')
};
const findMajorArr=(majorCourseArr,step)=>{
    const arr = majorCourseArr.filter(item=>item.trainStep === step);
    return _.uniq(_.map(arr,(item)=>item.majorReq));
};
const formatTrainHours=(planItem, unitForceTime)=>{
    let hoursPerDay = unitForceTime;
    if (planItem.task === '应急') hoursPerDay = 7;
    const days = (planItem.hours/hoursPerDay).toFixed(1);

    return `${days}天${planItem.hours}小时`
};
const handlerFormatCourseName=(item) =>{
    let name = item.name;
    (!_.isEmpty(item.gunnerType)) && (name = `${name}(${item.gunnerType}训)`);
    (!_.isEmpty(item.serviceReq)) && (name = `${name}(${item.serviceReq.join('、')})`);

    const courseRanks = item.rankL2Reqs || item.ranks;
    if (!_.isEmpty(courseRanks) && !name.includes('士官')) {
        if (courseRanks.length===1) {
            name=`${name}(${courseRanks[0]})`;
        } else {
            let ranks = _.uniq(courseRanks.map(rank => MapRankToLevel2(rank)));
            if (ranks.length > 2) {
                ranks = _.uniq(courseRanks.map(rank => MapRankToLevel1(rank)));
            }
            name = `${name}(${ranks.join('、')}训)`
        }
    }

    return name;
};
export const handleExportCallBack= (sheet, excelName, tableData)=>{
    let contentPlanSteps = [];
    let [contentWidth, contentHeight, contentWidthArrX, contentHeightArrY, contentWidthArrValueX, contentHeightArrValueY] = [0, 1, [], [], [], []];
    tableData.planItems.map((planItem, indexX) =>{
        let arrXY = [];
        tableData.trainSteps.map((step, indexY)=>{
            let hasMajorCoursesLength = findMajorArr(planItem.majorCourses,step).length;
            arrXY.push({
                x: indexX,
                y: indexY,
                taskX: planItem.task,
                stepY: step,
                widthX: hasMajorCoursesLength && 4 || 1,
                heightY: hasMajorCoursesLength || 1,
                hasMajor: !!hasMajorCoursesLength,
            });
            contentPlanSteps.push(arrXY[indexY]);
        });
        let maxWidth = _.uniqBy(_.orderBy(arrXY, ['widthX'], ['desc']), 'stepY')[0];
        contentWidth += maxWidth.widthX;
        contentWidthArrX.push(maxWidth)
    });
    let tableLetters = Letters.slice(0, 6+ contentWidth);
    let tableContentLetters = Letters.slice(2, 2+ contentWidth);
    let columnWidth = 70/tableContentLetters.length;
    tableLetters.map(item=>{
        (!tableContentLetters.includes(item)) && sheet.column(item).width((item === 'A' || item === 'B' ) && 3 || 6);
        if(tableContentLetters.includes(item)) sheet.column(item).width(columnWidth);
    });
    contentHeightArrY = _.uniqBy(_.orderBy(contentPlanSteps, ['heightY'], ['desc']), 'stepY');
    contentWidthArrValueX =  contentWidthArrX.reduce((prev, cur, index)=>{
        prev.push([0+ (index && prev[index-1][1]), 0+ (index && prev[index-1][1]) + cur.widthX, cur]);
        return prev;
    }, []);
    contentHeightArrValueY =  contentHeightArrY.reduce((prev, cur, index)=>{
        contentHeight += cur.heightY;
        prev.push([0+ (index && prev[index-1][1]), 0+ (index && prev[index-1][1]) + cur.heightY, cur]);
        return prev;
    }, []);
    contentPlanSteps.map(item=>{
        contentHeightArrY.map(subItem=>{if (item.stepY === subItem.stepY)item.length = subItem.heightY});
        contentWidthArrX.map(subItem=>{if (item.taskX === subItem.taskX)item.width = subItem.widthX});
    });
    sheet.range(`A1:${tableLetters[tableLetters.length-1]}1`).merged(true).value(excelName).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center'});
    if (contentWidth === 1)sheet.cell('C3').value('内容与时间分配').style({fontSize: 7,border: true, bold: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    else {
        sheet.range(`C3:${tableContentLetters[tableContentLetters.length-1]}3`).value('内容与时间分配').merged(true).style({fontSize: 7,border: true, bold: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    }
    let rangeArr = [
        {range: 'A3:B5', value: '区分', bold: true, border: true},
        {range: `${tableLetters[tableLetters.length-4]}3:${tableLetters[tableLetters.length-4]}5`, value: '训练\n时间', bold: true, border: true},
        {range: `${tableLetters[tableLetters.length-3]}3:${tableLetters[tableLetters.length-3]}5`, value: '重要\n训练\n活动', bold: true, border: true},
        {range: `${tableLetters[tableLetters.length-2]}3:${tableLetters[tableLetters.length-2]}5`, value: '质量\n指标', bold: true, border: true},
        {range: `${tableLetters[tableLetters.length-1]}3:${tableLetters[tableLetters.length-1]}5`, value: '措施\n要求', bold: true, border: true},
        {range: `A6:A${contentHeight + 5}`, value: tableData.orgCategory,  border: true, verticalText: true},
        {range: `${tableLetters[tableLetters.length-3]}6:${tableLetters[tableLetters.length-3]}${contentHeight + 5}`, value: tableData.activities, bold: true, border: true},
        {range: `${tableLetters[tableLetters.length-2]}6:${tableLetters[tableLetters.length-2]}${contentHeight + 5}`, value: tableData.scoreReqs, bold: true, border: true},
        {range: `${tableLetters[tableLetters.length-1]}6:${tableLetters[tableLetters.length-1]}${contentHeight + 5}`, value: tableData.methods, bold: true, border: true},
        {range: `${tableLetters[tableLetters.length-4]}7:${tableLetters[tableLetters.length-4]}${contentHeight + 5}`, value: handleExportStr(stepTrainTime(tableData)),  border: true},
        {range: `A${6+contentHeight}:C${contentHeight+6}`, value: '审核人:', horizontalAlignment: 'left'},
        {range: `D${6+contentHeight}:${tableLetters[tableLetters.length-3]}${contentHeight+6}`, value: '填写人：'}
    ];
    let rowArr = [{row: 1, height: 25},{row: 2, height: 5},{row: 4, height: 30}];
    sheet.cell(`${tableLetters[tableLetters.length-1]}${contentHeight+6}`).value(CommonAPI.format((tableData||{}).date, 'MM月DD日')).style({fontSize: 7,wrapText: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    sheet.cell('B6').value('警官').style({fontSize: 7,wrapText: true,border: true,horizontalAlignment: 'center',verticalAlignment: 'center',verticalText: true,});
    sheet.cell(`${tableLetters[tableLetters.length-4]}6`).value(`${tableData.officerTime && tableData.officerTime.timeReq.hours}小时`).style({fontSize: 7,border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    rangeArr.map(item=>{sheet.range(item.range).merged(true).value(item.value).style({fontSize: 7,wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: item.horizontalAlignment||'center',verticalAlignment: 'center', verticalText: item.verticalText})});
    rowArr.map(item=>sheet.row(item.row).height(item.height));
    tableData.planItems.map((item, index)=>{
        let value1 = `${(item|| {}).task}\n${CommonAPI.format((item|| {}).fromDate, 'MM月DD日')}至${CommonAPI.format((item|| {}).toDate, 'MM月DD日')}）`;
        let value2 = formatTrainHours(item, unitForceTime(tableData));
        let officerCoursesValue = [];
        item.officerCourses.map(item=>officerCoursesValue.push(item.name));
        if (contentWidthArrValueX[index][2].width === 1){
            sheet.cell(`${tableContentLetters[contentWidthArrValueX[index][0]]}4`).value(value1).style({fontSize: 7,wrapText: true,border: true, bold: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`${tableContentLetters[contentWidthArrValueX[index][0]]}5`).value(value2).style({fontSize: 7,wrapText: true,border: true, bold: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`${tableContentLetters[contentWidthArrValueX[index][0]]}6`).value(officerCoursesValue.join('\n')).style({fontSize: 7,wrapText: true,border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
        } else {
            sheet
                .range(`${tableContentLetters[contentWidthArrValueX[index][0]]}4:${tableContentLetters[contentWidthArrValueX[index][1]-1]}4`).merged(true).value(value1).style({fontSize: 7,wrapText: true,border: true, bold: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet
                .range(`${tableContentLetters[contentWidthArrValueX[index][0]]}5:${tableContentLetters[contentWidthArrValueX[index][1]-1]}5`).merged(true).value(value2).style({fontSize: 7,wrapText: true,border: true, bold: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet
                .range(`${tableContentLetters[contentWidthArrValueX[index][0]]}6:${tableContentLetters[contentWidthArrValueX[index][1]-1]}6`).merged(true).value(officerCoursesValue.join('\n')).style({fontSize: 7,wrapText: true,border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
        }
    });
    let contentHeightArr = [];
    let contentItemsAddNum = 0;
    tableData.trainSteps.map((step, index)=>{
        let valueLength = {commonLength:[], majorLength: []};
        if (contentHeightArrValueY[index][2].heightY === 1) sheet.cell(`B${7+contentHeightArrValueY[index][0]}`).value(step).style({fontSize: 7,wrapText: true,border: true,horizontalAlignment: 'center',verticalAlignment: 'center', verticalText: true});
        else {
            sheet.range(`B${7+contentHeightArrValueY[index][0]}:B${7+contentHeightArrValueY[index][1]-1}`).value(step).merged(true).style({fontSize: 7,wrapText: true,border: true,horizontalAlignment: 'center',verticalAlignment: 'center', verticalText: true});
        }
        tableData.planItems.map((planItems, subIndex)=>{
            let commonValue = [];
            filterArrByItemKeyValue(planItems.commonCourses,'trainStep',step).map(item=>commonValue.push(handlerFormatCourseName(item)));
            valueLength.commonLength.push(commonValue.length);
            let contentItem = contentPlanSteps.find(item=>{if (item.stepY === step && item.taskX === planItems.task) return item});
            if ((contentItem.length === 1 && contentItem.width===1) || (contentItem.hasMajor && contentItem.length === 1)) sheet.cell(`${tableContentLetters[contentWidthArrValueX[subIndex][0]]}${7+contentHeightArrValueY[index][0]}`).value(commonValue.join('\n')).style({fontSize: 7,wrapText: true,border: true,horizontalAlignment: 'center',verticalAlignment: 'center'});
            else {
                if (contentItem.hasMajor){
                    sheet.range(`${tableContentLetters[contentWidthArrValueX[subIndex][0]]}${7+contentHeightArrValueY[index][0]}:${tableContentLetters[contentWidthArrValueX[subIndex][0]]}${6+contentHeightArrValueY[index][1]}`).merged(true).value(commonValue.join('\n')).style({fontSize: 7,wrapText: true,border: true,horizontalAlignment: 'center',verticalAlignment: 'center'});
                } else {
                    if (contentItem.length === 1 && contentItem.width>1) {
                        sheet.range(`${tableContentLetters[contentWidthArrValueX[subIndex][0]]}${7+contentHeightArrValueY[index][0]}:${tableContentLetters[contentWidthArrValueX[subIndex][0]+3]}${7+contentHeightArrValueY[index][0]}`).merged(true).value(commonValue.join('\n')).style({fontSize: 7,wrapText: true,border: true,horizontalAlignment: 'center',verticalAlignment: 'center'});
                    } else if (contentItem.width === 1 && contentItem.length>1){
                        sheet.range(`${tableContentLetters[contentWidthArrValueX[subIndex][0]]}${7+contentHeightArrValueY[index][0]}:${tableContentLetters[contentWidthArrValueX[subIndex][0]]}${6+contentHeightArrValueY[index][1]}`).merged(true).value(commonValue.join('\n')).style({fontSize: 7,wrapText: true,border: true,horizontalAlignment: 'center',verticalAlignment: 'center'});
                    } else {
                        sheet.range(`${tableContentLetters[contentWidthArrValueX[subIndex][0]]}${7+contentHeightArrValueY[index][0]}:${tableContentLetters[contentWidthArrValueX[subIndex][0]+3]}${6+contentHeightArrValueY[index][1]}`).merged(true).value(commonValue.join('\n')).style({fontSize: 7,wrapText: true,border: true,horizontalAlignment: 'center',verticalAlignment: 'center'});
                    }
                }

            }
            if (contentItem.hasMajor){
                let majorValue = findMajorArr(planItems.majorCourses,step);
                sheet.column(tableContentLetters[contentWidthArrValueX[subIndex][0]]).width(columnWidth*1.5);
                sheet.column(tableContentLetters[contentWidthArrValueX[subIndex][0]+1]).width(columnWidth*0.5);
                majorValue.map((major, majorIndex)=> {
                    let majorArr = filterArrByItemKeyValue(filterArrByItemKeyValue(planItems.majorCourses, 'majorReq', major), 'trainStep', step);
                    let majorArrValue = [];
                    majorArr.map(subMajor => majorArrValue.push(handlerFormatCourseName(subMajor)));
                    valueLength.majorLength.push({value: majorArrValue.length, index: majorIndex});
                    if ((majorValue.length< contentItem.length) && !majorIndex){
                        let $length = contentItem.length-majorValue.length;
                        sheet.range(`${tableContentLetters[contentWidthArrValueX[subIndex][0]+1]}${7+majorIndex+contentHeightArrValueY[index][0]}:${tableContentLetters[contentWidthArrValueX[subIndex][0]+1]}${7+majorIndex+contentHeightArrValueY[index][0] + $length}`).merged(true).value(major).style({fontSize: 7,wrapText: true,border: true,horizontalAlignment: 'center',verticalAlignment: 'center'});
                        sheet.range(`${tableContentLetters[contentWidthArrValueX[subIndex][0]+2]}${7+majorIndex+contentHeightArrValueY[index][0]}:${tableContentLetters[contentWidthArrValueX[subIndex][0]+3]}${7+majorIndex+contentHeightArrValueY[index][0] + $length}`).merged(true).value(majorArrValue.join('\n')).style({fontSize: 7,wrapText: true,border: true,horizontalAlignment: 'center',verticalAlignment: 'center'});
                    } else {
                        sheet.cell(`${tableContentLetters[contentWidthArrValueX[subIndex][0]+1]}${7+majorIndex+contentHeightArrValueY[index][0]}`).value(major).style({fontSize: 7,wrapText: true,border: true,horizontalAlignment: 'center',verticalAlignment: 'center'});
                        sheet.range(`${tableContentLetters[contentWidthArrValueX[subIndex][0]+2]}${7+majorIndex+contentHeightArrValueY[index][0]}:${tableContentLetters[contentWidthArrValueX[subIndex][0]+3]}${7+majorIndex+contentHeightArrValueY[index][0]}`).merged(true).value(majorArrValue.join('\n')).style({fontSize: 7,wrapText: true,border: true,horizontalAlignment: 'center',verticalAlignment: 'center'});
                    }
                })
            }
        });

        let maxCommonLength =  Math.max.apply(null, valueLength.commonLength);
        let maxMajorLength = _.uniqBy(_.orderBy(valueLength.majorLength, ['value'], ['desc']), 'index');
        let majorAddNum = 0;
        maxMajorLength.map(item=> majorAddNum+= item.value);
        contentItemsAddNum += (majorAddNum > maxCommonLength ? majorAddNum : maxCommonLength);
        contentHeightArr.push({ maxCommonLength, maxMajorLength, index, majorLengthBig:  (majorAddNum > maxCommonLength)});
    });
    let rowAverageHeight = 500/contentItemsAddNum;
    contentHeightArr.map((item,index)=>{
        if (!item.maxMajorLength.length || (item.maxMajorLength.length ===1 && !item.majorLengthBig)){
            sheet.row(7+contentHeightArrValueY[index][0]).height(rowAverageHeight*item.maxCommonLength> 90 ?rowAverageHeight*item.maxCommonLength : 90);
        }else {
            item.maxMajorLength.map((subItem, subIndex)=>sheet.row(7+contentHeightArrValueY[index][0]+subIndex).height(subItem.value*rowAverageHeight));
        }
    })

};
