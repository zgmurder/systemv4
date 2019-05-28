import {Letters} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'

const comThRow=(tableData)=>{
    const found = tableData.trainSteps.find(item=>item.majorCourses && item.majorCourses.length);
    return found ? 3 : 2
};
const comStep=(tableData)=>{
    return tableData.trainSteps.filter(item=>item.majorCourses && item.majorCourses.length);
};
const comThCol=(tableData)=>{
    return comStep(tableData).length*3 + tableData.trainSteps.length
};
const hasMajors=(tableData)=>{
    return tableData.trainSteps.some(item=>item.majorCourses && item.majorCourses.length)
};
const toGroup = (courseArr=[])=>{
    const majors = [...new Set(courseArr.map(item=>item.major))];
    let group = [];
    majors.reduce((prev,cur,index)=>{
        const arr = prev.filter(item=>item.major === cur);
        group[index] = {
            name:cur,
            courses:arr
        };
        return prev.filter(item=>item.major !== cur);
    },courseArr);
    group = group.filter(item=>!!item.courses.length);
    return group;
};

export const handleExportCallBack = (sheet, excelName, tableData)=>{
    let tableLetters = Letters.slice(0, comThCol(tableData) + 5);
    const found = tableData.trainSteps.find(item=>item.majorCourses && item.majorCourses.length);
    let tableContentLetters = Letters.slice(1, comThCol(tableData) + 1);
    const departArr = found && _.countBy(found.majorCourses, 'depart') || {};
    const courseLength = found && found.majorCourses.length || 50;
    for(let i =0; i< courseLength; i++){ i && sheet.row(i+6).height(600/courseLength)}
    let rowArr = [{row:1, height: 25}, {row:2, height: 5}, {row: 4, height: 30}];
    rowArr.map(item=>sheet.row(item.row).height(item.height));
    tableLetters.map(item=>sheet.column(item).width(item === 'A'? 3.5 : 85/(tableLetters.length-1)));
    let rangeArr = [
        {range: `A3:A${comThRow(tableData)+2}`, value: '区分', border: true, bold: true},
        {range: `${tableLetters[tableLetters.length-4]}3:${tableLetters[tableLetters.length-4]}${comThRow(tableData)+2}`, value: '训练\n时间', border: true, bold: true},
        {range: `${tableLetters[tableLetters.length-3]}3:${tableLetters[tableLetters.length-3]}${comThRow(tableData)+2}`, value: '重要\n训练\n活动', border: true, bold: true},
        {range: `${tableLetters[tableLetters.length-2]}3:${tableLetters[tableLetters.length-2]}${comThRow(tableData)+2}`, value: '质量\n指标', border: true, bold: true},
        {range: `${tableLetters[tableLetters.length-1]}3:${tableLetters[tableLetters.length-1]}${comThRow(tableData)+2}`, value: '措施\n要求', border: true, bold: true},
        {range: `${tableLetters[tableLetters.length-4]}${comThRow(tableData)+3}:${tableLetters[tableLetters.length-4]}${comThRow(tableData)+2+courseLength}`, value: tableData.timeReq, border: true,},
        {range: `${tableLetters[tableLetters.length-3]}${comThRow(tableData)+3}:${tableLetters[tableLetters.length-3]}${comThRow(tableData)+2+courseLength}`, value: tableData.activities, border: true, },
        {range: `${tableLetters[tableLetters.length-2]}${comThRow(tableData)+3}:${tableLetters[tableLetters.length-2]}${comThRow(tableData)+2+courseLength}`, value: tableData.scoreReqs, border: true,},
        {range: `${tableLetters[tableLetters.length-1]}${comThRow(tableData)+3}:${tableLetters[tableLetters.length-1]}${comThRow(tableData)+2+courseLength}`, value: tableData.methods, border: true, },
        {range: `B${comThRow(tableData)+3+courseLength}:${tableLetters[tableLetters.length-1]}${comThRow(tableData)+3+courseLength}`, value: tableData.notes, border: true},
        {range: `A${comThRow(tableData)+4+courseLength}:B${comThRow(tableData)+4+courseLength}`, value: '审核人：', horizontalAlignment: 'left'},
        {range: `C${comThRow(tableData)+4+courseLength}:${tableLetters[tableLetters.length-2]}${comThRow(tableData)+4+courseLength}`, value: '填写人：'},
    ];
    let cellArr = [
        {cell: `A${comThRow(tableData)+3+courseLength}`, value: '备注', border: true},
        {cell: `${tableLetters[tableLetters.length-1]}${comThRow(tableData)+4+courseLength}`, value: CommonAPI.format(tableData.date, 'YYYY年')},
        ];
    if (tableContentLetters.length>1) rangeArr.push({range: `B3:${tableContentLetters[tableContentLetters.length-1]}3`,value: '内容与时间分配', border: true, bold: true});
    else {
        cellArr.push({cell: 'B3', value: '内容与时间分配', border: true, bold: true});
    }
    let tableContentArrValueX = tableData.trainSteps.reduce((prev, cur, index)=>{
        let colspan = cur.majorCourses && cur.majorCourses && 4 || 1;
        prev.push({ from: index && prev[index-1].to || 0, to: index && colspan + prev[index-1].to || colspan, length: colspan});
        return prev;
    }, []);
    let tableContentLeftArrY = Object.keys(departArr).reduce((prev, cur, index)=>{
        prev.push([(index && prev[index-1][1])+0, (index && prev[index-1][1]) + departArr[cur], cur, departArr[cur]]);
        return prev
    }, []);
    tableContentLeftArrY.map(item=>{
        if (item[3]>1) rangeArr.push({range: `A${comThRow(tableData)+3+item[0]}:A${comThRow(tableData)+2+item[1]}`, value: item[2], border: true,verticalText: true});
        else {
            cellArr.push({cell: `A${comThRow(tableData)+3+item[0]}`, value: item[2], border: true,verticalText: true})
        }
    });
    tableData.trainSteps.map((item, index)=>{
        let rowspan= hasMajors ? (item.majorCourses && item.majorCourses && 1 || 2) : 1;
        let colspan= item.majorCourses && item.majorCourses && 4 || 1;
        let stepValue = `${item.name}\n${item.hoursAtNight && `（昼${item.hoursInDay}小时/夜${item.hoursAtNight}小时` ||  `（${item.hoursInDay}小时）`}`;
        if (rowspan === 1 && colspan === 1)cellArr.push({cell: `${tableContentLetters[tableContentArrValueX[index].from]}4`, value: stepValue, border: true, bold: true});
        else {
            if (colspan === 1)rangeArr.push({range: `${tableContentLetters[tableContentArrValueX[index].from]}4:${tableContentLetters[tableContentArrValueX[index].from]}5`, value: stepValue, border: true, bold: true});
            else {
                rangeArr.push({range: `${tableContentLetters[tableContentArrValueX[index].from]}4:${tableContentLetters[tableContentArrValueX[index].to-1]}4`, value: stepValue, border: true, bold: true});
            }
        }
        if (item.majorCourses) {
            let cellValue = `基本技能\n${item.commonStats.hoursAtNight && `昼${item.commonStats.hoursInDay}/夜${item.commonStats.hoursAtNight}（时）` || `（${item.commonStats.hoursInDay}小时）`}`;
            let rangeValue = `专业技能${item.majorStats.hoursAtNight && `昼${item.majorStats.hoursInDay}/夜${item.majorStats.hoursAtNight}（时）` || `（${item.majorStats.hoursInDay}小时）`}`;
            sheet.column(tableContentLetters[tableContentArrValueX[index].from]).width(126/(tableLetters.length-1));
            sheet.column(tableContentLetters[tableContentArrValueX[index].from+1]).width(42/(tableLetters.length-1));
            cellArr.push({cell: `${tableContentLetters[tableContentArrValueX[index].from]}5`,value: cellValue,border: true,bold: true
            });
            rangeArr.push({range: `${tableContentLetters[tableContentArrValueX[index].from + 1]}5:${tableContentLetters[tableContentArrValueX[index].to - 1]}5`,value: rangeValue, border: true, bold: true});
            let majorCoursesToGroup = toGroup(item.majorCourses);
            let majorCoursesToGroupV2 = majorCoursesToGroup.reduce((prev, cur, index) => {
                prev.push([0 + (index && prev[index - 1][1]), 0 + (index && prev[index - 1][1]) + cur.courses.length, cur]);
                return prev
            }, []);
            majorCoursesToGroupV2.map(subItem => {
                if (subItem[2].courses.length === 1) cellArr.push({cell: `${tableContentLetters[tableContentArrValueX[index].from + 1]}${subItem[0]+6}`,value: subItem[2].name, border: true,});
                else {
                    rangeArr.push({range: `${tableContentLetters[tableContentArrValueX[index].from + 1]}${subItem[0]+6}:${tableContentLetters[tableContentArrValueX[index].from + 1]}${subItem[1] + 5}`, value: subItem[2].name, border: true});
                }
                let majorCoursesArr = [];
                subItem[2].courses.map(course => majorCoursesArr.push(course.name));
                rangeArr.push({range: `${tableContentLetters[tableContentArrValueX[index].from + 2]}${subItem[0] + 6}:${tableContentLetters[tableContentArrValueX[index].from + 3]}${subItem[1] + 5}`, value: majorCoursesArr.join('\n'), border: true});
            });
        }
        let commonCourses = [];
        item.commonCourses.map(course=> commonCourses.push(course.name));
        rangeArr.push({range: `${tableContentLetters[tableContentArrValueX[index].from]}${comThRow(tableData)+3}:${tableContentLetters[tableContentArrValueX[index].from]}${comThRow(tableData)+2+courseLength}`, value:commonCourses.join('\n'), border: true });
    });
    sheet.range(`A1:${tableLetters[tableLetters.length-1]}1`).merged(true).value(excelName).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center',});
    rangeArr.map(item=>sheet.range(item.range).merged(true).value(item.value).style({fontSize: 7,wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: item.horizontalAlignment ||'center',verticalAlignment: 'center', verticalText: item.verticalText}));
    cellArr.map(item=>sheet.cell(item.cell).value(item.value).style({fontSize: 7,wrapText: true, border: item.border ,bold: item.bold, horizontalAlignment: item.horizontalAlignment ||'center',verticalAlignment: 'center', verticalText: item.verticalText}));
};



