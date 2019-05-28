import {WeekDays, Letters} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'
import _ from 'lodash'

const comTrainData=(tableData)=>{
    return _.isEmpty(tableData.trainMajors)?tableData.trainOrgs.map(item=>item.name):tableData.trainMajors
};

const handlerFormatApprovedBy=(tableData)=> {
    const position = tableData.approvedByPosition||(tableData.approvedBy||{}).position;
    const name = tableData.approvedByName||(tableData.approvedBy||{}).name;
    return position ? `${position}: ${name}` : name;
};

const totalLessons=(tableData)=>{
    let [dailyLesson,lessons,indexArr,rowArr,lessonArr] = [[],[],[0],[],[]];
    tableData.dailyLessons.forEach((item)=>{
        const A = ['早操','夜间'];
        const {date,weekday} = item;
        const subArr = item.lessons.map((v,i)=>{v._index = i;return v}).filter(lesson=>!A.includes(lesson.section));
        const B = item.lessons.filter(lesson=>A.includes(lesson.section));
        const len = indexArr[indexArr.length-1]||0;
        indexArr.push(subArr.length+len);
        lessonArr = [...lessonArr,B];
        dailyLesson = [...dailyLesson,{date,weekday}];
        rowArr = [...rowArr,subArr.length];
        lessons = [...lessons,...subArr]
    });
    return {lessons,indexArr,rowArr,lessonArr,dailyLesson}
};
const handlerRowSpan=(arr,index, tableData)=>{
    const i = arr.findIndex(item=>item === index);
    return totalLessons(tableData).rowArr[i]
};
const handlerNotes=(str)=>{
    if(!str)return;
    return str.replace(/\n$/,"");
};

const momingOrNight=(index, tableData)=>{
    const i = totalLessons(tableData).indexArr.findIndex(item=>item === index);
    return totalLessons(tableData).lessonArr[i]
};
const dateOrWeekday=(index, tableData)=>{
    const i = totalLessons(tableData).indexArr.findIndex(item=>item === index);
    return totalLessons(tableData).dailyLesson[i]
};
const handlerFilterWeek=(week)=>{
    return WeekDays[week].shortName
};

const combineRow=(section,index, tableData)=>{
    const lessons = totalLessons(tableData).lessons;
    const calculate = (section,index,num = 1)=>{
        const is = (lessons[index+1]||{}).section === section;
        return is ? calculate(section,index+1,num+1) : num;
    };
    return calculate(section,index)
};
const showRow=(section,index, tableData)=>{
    const lesson = totalLessons(tableData).lessons[index-1];
    return (lesson||{}).section !== section;
};

const majorIsShow=(courses, tableData)=>{
    return courses.some(item=>(tableData.trainMajors||[]).includes(item.major))
};

const handlerFilterCourses=(courses,major)=>{
    if(_.isEmpty(courses))return ' ';
    if(major && typeof major === 'string')courses = courses.filter(item=>item.major === major)
    const courseNames = courses.map(course => {
        let subNames = _.isEmpty(course.inputText) ? [] : [course.inputText];
        if (!_.isEmpty(course.subcourses)) {
            subNames = course.subcourses.map(subcourse => {
                let sub2Name = _.isEmpty(subcourse.subcourses) ? subcourse.inputText : subcourse.subcourses.map(item => item.name).join('、');
                return _.isEmpty(sub2Name) ? `${subcourse.name}` : `${subcourse.name}：${sub2Name}`;
            });
        }
        return _.isEmpty(subNames) ? course.name : `${course.name}：${subNames.join('，')}`;
    });

    return courseNames.join('；');
};
export const handleExportCallBack=(sheet, excelName, tableData)=> {
    let tableLetters = Letters.slice(0, 9+comTrainData(tableData).length);
    let comTrainWidth = 28/comTrainData(tableData).length;
    let comTrainLetters = Letters.slice(3, 3+comTrainData(tableData).length );
    let rangeArr = [
        { range: 'A3:B3', value: `审批：${handlerFormatApprovedBy(tableData) || ''}`, horizontalAlignment: 'left'},
        { range: `${tableLetters[tableLetters.length-4]}3:${tableLetters[tableLetters.length-1]}3`, value: `制表时间：${CommonAPI.format(tableData.createdAt)}`, },
        { range: 'A4:C4', value: '时间', border: true, bold: true,},
        { range: 'B5:C5', value: '课时', border: true, bold: true,},
        { range: `${tableLetters[tableLetters.length-6]}4:${tableLetters[tableLetters.length-6]}5`, value: '实施\n方法', border: true, bold: true,},
        { range: `${tableLetters[tableLetters.length-5]}4:${tableLetters[tableLetters.length-5]}5`, value: '保障\n措施', border: true, bold: true,},
        { range: `${tableLetters[tableLetters.length-4]}4:${tableLetters[tableLetters.length-4]}5`, value: '地点', border: true, bold: true,},
        { range: `${tableLetters[tableLetters.length-3]}4:${tableLetters[tableLetters.length-3]}5`, value: '教练员\n组织者', border: true, bold: true,},
        { range: `${tableLetters[tableLetters.length-2]}4:${tableLetters[tableLetters.length-2]}5`, value: '早晨', border: true, bold: true,},
        { range: `${tableLetters[tableLetters.length-1]}4:${tableLetters[tableLetters.length-1]}5`, value: '晚上', border: true, bold: true,},
        { range: `A${6+ totalLessons(tableData).lessons.length}:C${6+ totalLessons(tableData).lessons.length}`, value: '备  注', border: true,},
        { range: `D${6+ totalLessons(tableData).lessons.length}:${tableLetters[tableLetters.length-1]}${6+ totalLessons(tableData).lessons.length}`, value: handlerNotes(tableData.notes), border: true,horizontalAlignment: 'left' },
        { range: `A${7+ totalLessons(tableData).lessons.length}:B${7+ totalLessons(tableData).lessons.length}`, value: '中队长：', horizontalAlignment: 'left'},
        { range: `${tableLetters[tableLetters.length-3]}${7+ totalLessons(tableData).lessons.length}:${tableLetters[tableLetters.length-1]}${7+ totalLessons(tableData).lessons.length}`, value: '政治指导员：', horizontalAlignment: 'left' },
        { range: `${tableLetters[tableLetters.length-6]}6:${tableLetters[tableLetters.length-6]}${totalLessons(tableData).lessons.length + 5}`, value: handlerNotes(tableData.methods), border: true, bold: true,},
        { range: `${tableLetters[tableLetters.length-5]}6:${tableLetters[tableLetters.length-5]}${totalLessons(tableData).lessons.length + 5}`, value: handlerNotes(tableData.ensures), border: true, bold: true,},
    ];
    let rowHight = 620/(2 + totalLessons(tableData).lessons.length);
    for(let i = 0; i< (3+ totalLessons(tableData).lessons.length); i++){
        sheet.row(i+4 ).height(i === (2 + totalLessons(tableData).lessons.length) && 40 || rowHight);
    }
    let cellArr = [
        { cell: 'A5', value: '日/星期', border: true, bold: true,}
    ];
    let rowArr = [{row: 1,height: 25}, {row: 2,height: 5}];
    if (comTrainData(tableData).length === 1)sheet.cell(`${comTrainLetters[0]}4`).value('训练内容').style({border: true, bold: true,horizontalAlignment: 'center',verticalAlignment: 'center', });
    else {
        sheet.range(`${comTrainLetters[0]}4:${comTrainLetters[comTrainLetters.length-1]}4`).merged(true).value('训练内容').style({border: true, bold: true,horizontalAlignment: 'center',verticalAlignment: 'center', });
    }
    comTrainData(tableData).map((item, index)=>{
        sheet.cell(`${comTrainLetters[index]}5`).value(item).style({border: true, bold: true,horizontalAlignment: 'center',verticalAlignment: 'center', });
    });
    let [dateArr, dateArrValue, morningOrNightArrValue, sectionArr, sectionArrValue] = [[], [], [], [], []];
    totalLessons(tableData).lessons.map((item, index)=>{
        if (totalLessons(tableData).indexArr.includes(index)){
            dateArr.push({
                length: handlerRowSpan(totalLessons(tableData).indexArr,index, tableData),
                value: `${CommonAPI.format(dateOrWeekday(index, tableData).date, 'DD日')}/${handlerFilterWeek(dateOrWeekday(index, tableData).weekday)}`});
            morningOrNightArrValue.push(momingOrNight(index, tableData));
        }
        if (showRow(item.section,index, tableData)){
            sectionArr.push({
                length: combineRow(item.section,index, tableData),
                value: item.section
            })
        }
        if (majorIsShow(item.courses, tableData)){
            comTrainData(tableData).map((major, index)=>{
                sheet.cell(`${comTrainLetters[index]}${index+6}`).value(handlerFilterCourses(item.courses,major)).style({wrapText: true, border: true,  horizontalAlignment: 'center',verticalAlignment: 'center', });
            })
        } else {
            if (comTrainData(tableData).length < 2){
                sheet
                    .cell(`D${index+6}`).value(handlerFilterCourses(item.courses)).style({wrapText: true, border: true,  horizontalAlignment: 'center',verticalAlignment: 'center', });
            } else {
                sheet.range(`D${index+6}:${comTrainLetters[comTrainLetters.length-1]}${index+6}`).merged(true).value(handlerFilterCourses(item.courses)).style({wrapText: true, border: true,  horizontalAlignment: 'center',verticalAlignment: 'center', });
            }
        }
        sheet.cell(`C${index+6}`).value(item.hours).style({wrapText: true, border: true,  horizontalAlignment: 'center',verticalAlignment: 'center', });
        sheet.cell(`${tableLetters[tableLetters.length-4]}${index+6}`).value((item.place||{}).name||'').style({wrapText: true, border: true,  horizontalAlignment: 'center',verticalAlignment: 'center', });
        sheet.cell(`${tableLetters[tableLetters.length-3]}${index+6}`).value(item.trainerName||(item.trainer||{}).name||(tableData.theDuty||{}).name||'').style({wrapText: true, border: true,  horizontalAlignment: 'center',verticalAlignment: 'center', });
    });
    sectionArrValue = CommonAPI.handlerReduce(sectionArr);
    dateArrValue = CommonAPI.handlerReduce(dateArr);
    dateArrValue.map((item, index)=>{
        if (item[2].length === 1){
            sheet.cell(`A${item[0]+6}`).value(item[2].value).style({wrapText: true, border: true,  horizontalAlignment: 'center',verticalAlignment: 'center', });
            sheet.cell(`${tableLetters[tableLetters.length-2]}${item[0]+6}`).value(handlerFilterCourses((morningOrNightArrValue[index][0]|| {}).courses)).style({wrapText: true, border: true,  horizontalAlignment: 'center',verticalAlignment: 'center', });
            sheet.cell(`${tableLetters[tableLetters.length-1]}${item[0]+6}`).value(handlerFilterCourses((morningOrNightArrValue[index][1]|| {}).courses)).style({wrapText: true, border: true,  horizontalAlignment: 'center',verticalAlignment: 'center', });
        } else {
            sheet.range(`A${item[0]+6}:A${item[1]+5}`).merged(true).value(item[2].value).style({wrapText: true, border: true,  horizontalAlignment: 'center',verticalAlignment: 'center', });
            sheet
                .range(`${tableLetters[tableLetters.length-2]}${item[0]+6}:${tableLetters[tableLetters.length-2]}${item[1]+5}`)
                .value(handlerFilterCourses((morningOrNightArrValue[index][0]|| {}).courses))
                .merged(true)
                .style({wrapText: true, border: true,  horizontalAlignment: 'center',verticalAlignment: 'center', });
            sheet
                .range(`${tableLetters[tableLetters.length-1]}${item[0]+6}:${tableLetters[tableLetters.length-1]}${item[1]+5}`)
                .value(handlerFilterCourses((morningOrNightArrValue[index][1]|| {}).courses))
                .merged(true)
                .style({wrapText: true, border: true,  horizontalAlignment: 'center',verticalAlignment: 'center', });
        }
    });
    sectionArrValue.map(item=>{
        if (item[2].length === 1) sheet.cell(`B${item[0]+6}`).value(item[2].value).style({wrapText: true, border: true,  horizontalAlignment: 'center',verticalAlignment: 'center', });
        else {
            sheet.range(`B${item[0]+6}:B${item[1]+5}`).merged(true).value(item[2].value).style({wrapText: true, border: true,  horizontalAlignment: 'center',verticalAlignment: 'center', });
        }
    });
    sheet.range(`A1:${tableLetters[tableLetters.length-1]}1`).merged(true).value(excelName).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center',});
    rangeArr.map(item=>{
        sheet.range(item.range).merged(true).value(item.value).style({wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center', verticalText: item.verticalText});
    });
    cellArr.map(item=>{
        sheet.cell(item.cell).value(item.value).style({wrapText: true, border: item.border ,bold: item.bold,  horizontalAlignment: 'center',verticalAlignment: 'center', verticalText: item.verticalText});
    });
    tableLetters.map(item=>{
        let width = 7;
        if (item === 'A') width= 9.5;
        if (item === 'B') width= 6;
        if (item === 'C') width = 3;
        if (comTrainLetters.includes(item)) width = comTrainWidth;
        sheet.column(item).width(width);
    });
    rowArr.map(item=>{sheet.row(item.row).height(item.height)});
};
