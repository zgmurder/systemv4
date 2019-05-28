import {ScoreCriteria2, Letters} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'

const handlerScore=(Score,scoreSriteria='四级制')=>{
    const found = Object.values(ScoreCriteria2).find(item=>item.name === scoreSriteria);
    return (found && found.optionalScores)?found.optionalScores[Score]:Score
};
const repairTableLength=(tableData)=>{
    if(!tableData)return {};
    const len = tableData.courseScores.length;
    return len > 18 ? Math.ceil(len/3) : 6;
};
const handleCourseScores=(course)=> {
    if (!course) return;
    const found = Object.values(ScoreCriteria2).find(item=>item.name === course.criteria);
    return found.optionalScores[course.score];
};
const handlerFilterShape=(value, name)=>{
    if (value === undefined) return '';
    if (name === 'score') {
        return !value  ? '不及格' : '及格';
    } else {
        return value;
    }
};
export const handleExportCallBack=(sheet, excelName, tableData)=> {
    const tableLetters = Letters.slice(0, 8);
    const shapeValue=['height', 'weight', 'bmi', 'pbf', 'score'];
    const physicalValue = tableData.totalScore && `总分 : ${tableData.totalScore}\n总成绩 : ${handlerScore(tableData.sportScore, '七级制')}` || `总成绩 : ${handlerScore(tableData.sportScore, '七级制')}`;
    sheet.range(`A1:${tableLetters[tableLetters.length -1]}1`).merged(true).value(excelName).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center',});
    let rangeArr = [
        {range: 'B3:F3', value: tableData.organization && tableData.organization.displayName, border: true},
        {range: `A6:A${repairTableLength(tableData) + 5}`, value: '军事训练成绩', bold: true, border: true},
        {range: `A${repairTableLength(tableData) + 6}:A${repairTableLength(tableData) + 11}`, value: '军事体育训练成绩', bold: true, border: true},
        {range: `${tableLetters[tableLetters.length -1]}6:${tableLetters[tableLetters.length -1]}${repairTableLength(tableData) + 5}`, value: handlerScore(tableData.trainScore), border: true},
        {range: `${tableLetters[tableLetters.length -1]}${repairTableLength(tableData) + 6}:${tableLetters[tableLetters.length -1]}${repairTableLength(tableData) + 11}`, value: physicalValue, border: true},
        {range: `B${repairTableLength(tableData) + 12}:${tableLetters[tableLetters.length -2]}${repairTableLength(tableData) + 12}`, value: handlerScore(tableData.overAllScore), border: true},
        {range: `B${repairTableLength(tableData) + 13}:${tableLetters[tableLetters.length -2]}${repairTableLength(tableData) + 13}`, value: tableData.rewards, border: true},
        {range: `D${repairTableLength(tableData) + 14}:E${repairTableLength(tableData) + 14}`, value: '填写人：'},
        {range: `B${repairTableLength(tableData) + 6}:C${repairTableLength(tableData) + 6}`, value: '通用课目', bold: true, border: true},
        {range: `D${repairTableLength(tableData) + 6}:E${repairTableLength(tableData) + 6}`, value: '专项课目', bold: true, border: true},
        {range: `F${repairTableLength(tableData) + 6}:G${repairTableLength(tableData) + 6}`, value: '体型', bold: true, border: true},
        {range: `G${repairTableLength(tableData) + 14}:${tableLetters[tableLetters.length - 1]}${repairTableLength(tableData) + 14}`, value: CommonAPI.format(tableData.date), horizontalAlignment: 'right'},
    ];
    let cellArr = [
        {cell: 'A3', value: '单位', bold: true, border: true},
        {cell: 'A4', value: '姓名', bold: true, border: true},
        {cell: 'A5', value: '任现职时间', bold: true, border: true},
        {cell: `A${repairTableLength(tableData) + 12}`, value: '年度总成绩', bold: true, border: true},
        {cell: `A${repairTableLength(tableData) + 13}`, value: '表彰与成绩', bold: true, border: true},
        {cell: `A${repairTableLength(tableData) + 14}`, value: '审核人：', horizontalAlignment: 'left'},
        {cell: 'B4', value: tableData.name, border: true},
        {cell: 'B5', value: tableData.soldier && CommonAPI.format(tableData.soldier.positionAt, 'YYYY年MM月'), border: true},
        {cell: 'C4', value: '性别', bold: true, border: true},
        {cell: 'C5', value: '类别', bold: true, border: true},
        {cell: 'D4', value: tableData.person && tableData.person.gender, border: true},
        {cell: 'D5', value: tableData.soldier && tableData.soldier.soldierCategory, border: true},
        {cell: 'E4', value: '出生年月日', bold: true, border: true},
        {cell: 'E5', value: '专业', bold: true, border: true},
        {cell: `${tableLetters[tableLetters.length - 2]}3`, value: '职位', bold: true, border: true},
        {cell: `${tableLetters[tableLetters.length - 2]}4`, value: '入职年月', bold: true, border: true},
        {cell: `${tableLetters[tableLetters.length - 2]}5`, value: '证件号', bold: true, border: true},
        {cell: `${tableLetters[tableLetters.length - 1]}3`, value: tableData.position, border: true},
        {cell: `${tableLetters[tableLetters.length - 1]}4`, value: tableData.soldier && CommonAPI.format(tableData.soldier.enlistedAt, 'YYYY年MM月'), border: true},
        {cell: `${tableLetters[tableLetters.length - 1]}5`, value: tableData.cardId, border: true},
        {cell: `${tableLetters[tableLetters.length - 1]}${repairTableLength(tableData) + 12}`, value: '', border: true},
        {cell: `${tableLetters[tableLetters.length - 1]}${repairTableLength(tableData) + 13}`, value: '', border: true},
        {cell: `${tableLetters[tableLetters.length - 3]}${repairTableLength(tableData) + 7}`, value: '身高（cm）', border: true},
        {cell: `${tableLetters[tableLetters.length - 3]}4`, value: tableData.person && CommonAPI.format(tableData.person.birthday, 'YYYY年MM月DD日'), border: true},
        {cell: `${tableLetters[tableLetters.length - 3]}5`, value: tableData.soldier && tableData.soldier.majorType, border: true},
        {cell: `${tableLetters[tableLetters.length - 3]}${repairTableLength(tableData) + 8}`, value: '体重（kg）', border: true},
        {cell: `${tableLetters[tableLetters.length - 3]}${repairTableLength(tableData) + 9}`, value: '体型', border: true},
        {cell: `${tableLetters[tableLetters.length - 3]}${repairTableLength(tableData) + 10}`, value: '体脂（%）', border: true},
        {cell: `${tableLetters[tableLetters.length - 3]}${repairTableLength(tableData) + 11}`, value: '成绩评定', border: true},
    ];
    let rowArr = [{row: 1, height: 25},{row: 2, height: 5},{row: repairTableLength(tableData) + 13, height: 40},];
    let rowLength = repairTableLength(tableData)+ 10;
    let rowHeight = 630/rowLength;
    rowArr.map(item=>sheet.row(item.row).height(item.height));
    tableLetters.map(item=>sheet.column(item).width(11.1));
    rangeArr.map(item=>sheet.range(item.range).merged(true).value(item.value).style({fontSize: 9,wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
    cellArr.map(item=>sheet.cell(item.cell).value(item.value).style({fontSize: 9,wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
    for(let i = 0; i < rowLength; i ++){sheet.row(i+3).height(rowHeight)}
    for(let i = 0; i < repairTableLength(tableData); i++){
        sheet.cell(`B${i+6}`).value(tableData.courseScores[i] && tableData.courseScores[i].name).style({fontSize: 9,wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center'});
        sheet.cell(`C${i+6}`).value(handleCourseScores(tableData.courseScores[i])).style({fontSize: 9,wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center'});
        sheet.cell(`D${i+6}`).value(tableData.courseScores[i + repairTableLength(tableData)] && tableData.courseScores[i + repairTableLength(tableData)].name).style({fontSize: 9,wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center'});
        sheet.cell(`E${i+6}`).value(handleCourseScores(tableData.courseScores[i + repairTableLength(tableData)])).style({fontSize: 9,wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center'});
        sheet.cell(`F${i+6}`).value(tableData.courseScores[i + repairTableLength(tableData)*2] && tableData.courseScores[i + repairTableLength(tableData)*2].name).style({fontSize: 9,wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center'});
        sheet.cell(`G${i+6}`).value(handleCourseScores(tableData.courseScores[i + repairTableLength(tableData)*2])).style({fontSize: 9,wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center'});
    }
    for(let i = 0; i < 5; i++){
        sheet.cell(`B${repairTableLength(tableData) + 7 + i}`).value(tableData.requiredCourseScores[i] && tableData.requiredCourseScores[i].courseName).style({fontSize: 9,wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center'});
        sheet.cell(`C${repairTableLength(tableData) + 7 + i}`).value(handlerScore(tableData.requiredCourseScores[i] && tableData.requiredCourseScores[i].score, tableData.requiredScoreCriteria)).style({fontSize: 9,wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center'});
        sheet.cell(`D${repairTableLength(tableData) + 7 + i}`).value(tableData.optionalCourseScores[i] && tableData.optionalCourseScores[i].courseName).style({fontSize: 9,wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center'});
        sheet.cell(`E${repairTableLength(tableData) + 7 + i}`).value(handlerScore(tableData.optionalCourseScores[i] && tableData.optionalCourseScores[i].score, tableData.optionalScoreCriteria.name)).style({fontSize: 9,wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center'});
        sheet.cell(`G${repairTableLength(tableData) + 7 + i}`).value(handlerFilterShape(tableData.shape[shapeValue[i]], shapeValue[i])).style({fontSize: 9,wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center'});
    }
};
