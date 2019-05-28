import {Letters} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'

const repairTable=(tableData)=> {
    return tableData.dailyLessons.length <4 && 4 || tableData.dailyLessons.length
};

const handlerHour=(val)=> {
    if (!val) return;
    return `${val.lessons[0].hours}小时`;
};

const handlerPointer=(obj)=>{
    if (!obj || obj=== {}) return;
    return obj && obj.name;
};

const handlerCourse=(courses)=> {
    if(_.isEmpty(courses))return ' ';
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

const handlerDate=(date)=> {
    return !date ? '' : `${date}日`;
};

const showRow=(index,dailyLessons)=>{
    if(!dailyLessons[index])return true;
    const lessonArr = [dailyLessons[index],dailyLessons[index-1]];
    const dateNumArr = lessonArr.map(item=>item && item.dateNum);
    return dateNumArr[0] !== dateNumArr[1]
};
const combineRow=(index,dailyLessons)=>{
    if(!dailyLessons[index])return 1;
    const dateNum = dailyLessons[index].dateNum;
    const calculate = (dateNum,index,num = 1)=>{
        const is = dailyLessons[index+1] && dailyLessons[index+1].dateNum === dateNum;
        return is ? calculate(dateNum,index+1,num+1) : num;
    };
    return calculate(dateNum,index);
};
export const handleExportCallBack=(sheet, excelName, tableData)=> {
    let tableLetters = Letters.slice(0, tableData.departs.length+8);
    let tableContentLetters = Letters.slice(3, tableData.departs.length+3);
    let tableContentHight = 385/(1+repairTable(tableData));
    let rangeArr = [
        { range: 'A3:C3', value: `单位：${tableData.organization && tableData.organization.displayName || ''}`, horizontalAlignment: 'left'},
        { range: `${tableLetters[tableLetters.length-2]}3:${tableLetters[tableLetters.length-1]}3`, value: `时间：${CommonAPI.format(tableData.date)}`, horizontalAlignment: 'right'},
        { range: 'A4:C4', value: '时间', border: true, bold: true},
        { range: `D4:${tableContentLetters[tableContentLetters.length-1]}4`, value: '内容', border: true, bold: true},
        { range: `${tableLetters[tableLetters.length-5]}4:${tableLetters[tableLetters.length-5]}5`, value: '组训\n方法', bold: true, border:true},
        { range: `${tableLetters[tableLetters.length-4]}4:${tableLetters[tableLetters.length-4]}5`, value: '组织者\n（教练员）', bold: true, border:true},
        { range: `${tableLetters[tableLetters.length-3]}4:${tableLetters[tableLetters.length-3]}5`, value: '场地\n区分', bold: true, border:true},
        { range: `${tableLetters[tableLetters.length-2]}4:${tableLetters[tableLetters.length-2]}5`, value: '质量\n指标', bold: true, border:true},
        { range: `${tableLetters[tableLetters.length-1]}4:${tableLetters[tableLetters.length-1]}5`, value: '措施\n要求', bold: true, border:true},
        { range: 'B5:C5', value: '日期', border: true, bold: true},
        { range: `A${6+repairTable(tableData)}:C${6+repairTable(tableData)}`, value: '备注', border: true, bold: true},
        { range: `D${6+repairTable(tableData)}:${tableLetters[tableLetters.length-1]}${6+repairTable(tableData)}`, value: tableData.notes, border: true },
        { range: `A6:A${5+repairTable(tableData)}`, value: tableData.days, border: true},
        { range: `${tableLetters[tableLetters.length-2]}6:${tableLetters[tableLetters.length-2]}${5+repairTable(tableData)}`, value: tableData.scoreReqs, border: true},
        { range: `${tableLetters[tableLetters.length-1]}6:${tableLetters[tableLetters.length-1]}${5+repairTable(tableData)}`, value: tableData.notes, border: true},
    ];
    let cellArr = [
        { cell: 'A5', value: '天数', border: true, bold: true}
    ];
    let rowArr = [
        { row: 1, height: 25},
        { row: 2, height: 5},
        { row: 4, height: 20},
        { row: 5, height: 20},
    ];
    let [dateArr, dateValueArr] = [[], []];
    for(let i = 0; i<= repairTable(tableData); i++){
        if (i < repairTable(tableData)){
            sheet.cell(`C${i+6}`).value(handlerHour(tableData.dailyLessons[i])).style({horizontalAlignment: 'center',verticalAlignment: 'center',border: true,wrapText: true, });
            sheet.cell(`${tableLetters[tableLetters.length-5]}${i+6}`).value(tableData.dailyLessons[i] && (tableData.dailyLessons[i].lessons[0].trainMethod)).style({horizontalAlignment: 'center',verticalAlignment: 'center',border: true,wrapText: true, });
            sheet.cell(`${tableLetters[tableLetters.length-4]}${i+6}`).value(handlerPointer(tableData.dailyLessons[i] && (tableData.dailyLessons[i].lessons[0].trainer))).style({horizontalAlignment: 'center',verticalAlignment: 'center',border: true,wrapText: true, });
            sheet.cell(`${tableLetters[tableLetters.length-3]}${i+6}`).value(handlerPointer(tableData.dailyLessons[i] && (tableData.dailyLessons[i].lessons[0].place))).style({horizontalAlignment: 'center',verticalAlignment: 'center',border: true,wrapText: true, });
            sheet.range(`D${i+6}:${tableContentLetters[tableContentLetters.length -1]}${i+6}`).merged(true).value(handlerCourse(tableData.dailyLessons[i] && (tableData.dailyLessons[i].courses))).style({horizontalAlignment: 'center',verticalAlignment: 'center',border: true,wrapText: true, });
            if (showRow(i,tableData.dailyLessons))dateArr.push({length: combineRow(i,tableData.dailyLessons), value: handlerDate((tableData.dailyLessons[i] || {}).dateNum)});
        }
        sheet.row(6+i).height(tableContentHight);
    }
    dateValueArr = dateArr.reduce((prev, cur, index)=>{
        prev.push([0+ (index && prev[index-1][1]), cur.length+ (index && prev[index-1][1]), cur]);
        return prev;
    },[]);
    dateValueArr.map(item=>{
        if (item[2].length ===1) sheet.cell(`B${item[0]+6}`).value(item[2].value).style({horizontalAlignment: 'center',verticalAlignment: 'center',border: true,wrapText: true, });
        else {
            sheet.range(`B${item[0]+6}:B${item[1]+5}`).merged(true).value(item[2].value).style({horizontalAlignment: 'center',verticalAlignment: 'center',border: true,wrapText: true, });
        }
    });
    sheet.range(`A1:${tableLetters[tableLetters.length-1]}1`).merged(true).value(excelName).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center',});
    rangeArr.map(item=>sheet.range(item.range).merged(true).value(item.value).style({wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: item.horizontalAlignment ||'center',verticalAlignment: 'center', verticalText: item.verticalText}));
    cellArr.map(item=>sheet.cell(item.cell).value(item.value).style({wrapText: true, border: item.border ,bold: item.bold, horizontalAlignment: item.horizontalAlignment ||'center',verticalAlignment: 'center', verticalText: item.verticalText}));
    rowArr.map(item=>sheet.row(item.row).height(item.height));
    tableLetters.map(item=>{
        let width = 11;
        if (item === 'A') width = 6;
        if (tableContentLetters.includes(item))width=(50/tableData.departs.length);
        sheet.column(item).width(width)
    });
    tableData.departs.map((item, index)=>sheet.cell(`${tableContentLetters[index]}5`).value(item.name).style({wrapText: true, border: true ,bold: true,  horizontalAlignment: 'center',verticalAlignment: 'center',}));
};
