import {Letters, ScoreCriteria2} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'

const isZhongDui=(tableData)=>{
    return tableData.orgSequence === 6
};
const isBan=(tableData)=>{
    return tableData.orgSequence === 8
};
const commanderScores=(tableData)=>{
    return tableData.commanderScores
};
const childOrgScores=(tableData)=>{
    return isBan(tableData) ? tableData.personScores : tableData.childOrgScores
};
const courseScores=(tableData)=>{
    return tableData.courseScores
};
const scoreOptions= ScoreCriteria2.Level4.optionalScores;
export const handleExportCallBack=(sheet, excelName, tableData)=> {
    let localCommanderLength = isZhongDui(tableData)?3:2;
    let tableLetters = Letters.slice(0,7+ (localCommanderLength));
    let rangeArr = [
        { range: `A3:${tableLetters[localCommanderLength-1]}3`, value: '本级指挥官\n年度训练成绩', border: true, bold: true},
        { range: `${tableLetters[localCommanderLength]}3:${tableLetters[localCommanderLength+2]}3`, value: `下级${isBan(tableData)?'个人':'单位'}\n年度训练成绩`, border: true, bold: true},
        { range: `${tableLetters[localCommanderLength+3]}3:${tableLetters[tableLetters.length-2]}3`, value: '本级战术训练（专业合练）成绩', border: true, bold: true},
        { range: `${tableLetters[tableLetters.length-1]}3:${tableLetters[tableLetters.length-1]}4`, value: '年度\n训练\n成绩', border: true, bold: true},
        { range: `B21:${tableLetters[tableLetters.length-1]}21`, value: '“姓名”栏填写姓名加职务', border: true, horizontalAlignment: 'left'}
    ];
    let cellArr = [
        { cell: 'A4', value: '姓名', border: true, bold: true},
        { cell: `${tableLetters[tableLetters.length-8]}4`, value: '总评', border: true, bold: true},
        { cell: `${tableLetters[tableLetters.length-7]}4`, value: (!tableData.childOrgScores[0] && tableData.personScores[0]) && '姓名' || '单位', border: true, bold: true},
        { cell: `${tableLetters[tableLetters.length-6]}4`, value: '成绩', border: true, bold: true},
        { cell: `${tableLetters[tableLetters.length-5]}4`, value: '总评', border: true, bold: true},
        { cell: `${tableLetters[tableLetters.length-4]}4`, value: '课目', border: true, bold: true},
        { cell: `${tableLetters[tableLetters.length-3]}4`, value: '成绩', border: true, bold: true},
        { cell: `${tableLetters[tableLetters.length-2]}4`, value: '总评', border: true, bold: true},
        { cell: 'A21', value: '备注', border: true}
    ];
    if (isZhongDui(tableData)){
        sheet.cell('B4').value('成绩').style({wrapText: true, bold: true, border: true,  horizontalAlignment: 'center',verticalAlignment: 'center',})
    }
    for(let i = 0; i<16; i ++){
        sheet.row(i+5).height(33);
        if (i<8){
            if (!isZhongDui(tableData))(i===0) && (sheet.range('A5:A20').value(`${(commanderScores(tableData)[i]||{}).name}\n${(commanderScores(tableData)[i]||{}).position}`)).merged(true).style({fontSize: 11, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
            else {
                sheet.range(`A${i*2 + 5}:A${i*2+6}`).value(`${(commanderScores(tableData)[i]||{}).name || ''}\n${(commanderScores(tableData)[i]||{}).position || ''}`).merged(true).style({wrapText: true,fontSize: 11, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
                sheet.range(`B${i*2 + 5}:B${i*2+6}`).value(scoreOptions[(commanderScores(tableData)[i]||{}).score] || '').merged(true).style({wrapText: true,fontSize: 11, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
            }
            sheet.range(`${tableLetters[tableLetters.length-7]}${i*2 + 5}:${tableLetters[tableLetters.length-7]}${i*2+6}`).merged(true).value((childOrgScores(tableData)[i]||{}).position ? `${(childOrgScores(tableData)[i]||{}).name}\n${(childOrgScores(tableData)[i]||{}).position}`: (childOrgScores(tableData)[i]||{}).name).style({wrapText: true,fontSize: 11, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.range(`${tableLetters[tableLetters.length-6]}${i*2 + 5}:${tableLetters[tableLetters.length-6]}${i*2+6}`).merged(true).value(scoreOptions[(childOrgScores(tableData)[i]||{}).score]).style({wrapText: true,fontSize: 11, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
        }
        sheet.cell(`${tableLetters[tableLetters.length-4]}${i+5}`).value((courseScores(tableData)[i]||{}).name || (i===0?'点击右上角添加按钮':'　') || '').style({fontSize: 11, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
        sheet.cell(`${tableLetters[tableLetters.length-3]}${i+5}`).value(scoreOptions[(courseScores(tableData)[i]||{}).score] || '').style({fontSize: 11, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});

    }
    sheet.row(1).height(25);
    sheet.row(3).height(35);
    sheet.row(4).height(25);
    sheet.row(21).height(55);
    let columnWidth = isZhongDui(tableData) && 7.4 || 8.4;
    tableLetters.map((item, index)=>sheet.column(item).width(index === (tableLetters.length-4) && 19 || (!index && 10.8 || columnWidth)));
    sheet.range(`${tableLetters[tableLetters.length-8]}5:${tableLetters[tableLetters.length-8]}20`).merged(true).value(scoreOptions[tableData.commanderScore]).style({fontSize: 11, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    sheet.range(`${tableLetters[tableLetters.length-5]}5:${tableLetters[tableLetters.length-5]}20`).merged(true).value(scoreOptions[tableData.childrenScore]).style({fontSize: 11, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    sheet.range(`${tableLetters[tableLetters.length-2]}5:${tableLetters[tableLetters.length-2]}20`).merged(true).value(scoreOptions[tableData.tacticsScore]).style({fontSize: 11, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    sheet.range(`${tableLetters[tableLetters.length-1]}5:${tableLetters[tableLetters.length-1]}20`).merged(true).value(scoreOptions[tableData.annualScore]).style({fontSize: 11, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    sheet.range(`A1:${tableLetters[tableLetters.length-1]}1`).merged(true).value(excelName).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center',});
    rangeArr.map(item=>sheet.range(item.range).merged(true).value(item.value).style({wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: item.horizontalAlignment ||'center',verticalAlignment: 'center', verticalText: item.verticalText}));
    cellArr.map(item=>sheet.cell(item.cell).value(item.value).style({wrapText: true, border: item.border ,bold: item.bold, horizontalAlignment: item.horizontalAlignment ||'center',verticalAlignment: 'center', verticalText: item.verticalText}));
};
