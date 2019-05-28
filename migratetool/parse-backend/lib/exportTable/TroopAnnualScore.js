import {Letters, ScoreCriteria2} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'

const handleLevel4Score=(Score)=>{
    return ScoreCriteria2.Level4.optionalScores[Score]
};
export const handleExportCallBack=(sheet, excelName, tableData)=>{
    let tableLetters = Letters.slice(0, 6);
    let rangeArr = [
        {range: 'A3:A4', value: '本级机关年度\n训练成绩', border: true, bold: true},
        {range: 'B3:D3', value: '下级单位年度训练成绩', border: true, bold: true},
        {range: 'E3:E4', value: '本级机关年度\n训练成绩', border: true, bold: true},
        {range: 'F3:F4', value: '年度\n训练\n成绩', border: true, bold: true},
        {range: 'B17:F17', value: '直属单位合为一个下级单位', border: true, },
    ];
    let cellArr = [
        {cell: 'B4', value: '单位', border: true, bold: true},
        {cell: 'C4', value: '成绩', border: true, bold: true},
        {cell: 'D4', value: '总评', border: true, bold: true},
        {cell: 'A17', value: '备注', border: true, },
    ];
    for(let i= 0; i<13; i ++){
        if (i<12){
            sheet.cell(`B${i+5}`).value(tableData.childOrgScores[i] && tableData.childOrgScores[i].name || '').style({fontSize: 12, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`C${i+5}`).value(tableData.childOrgScores[i] && handleLevel4Score(tableData.childOrgScores[i].score) || '').style({fontSize: 12, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
        }
        sheet.row(i+5).height(i===13 ? 50 : 43);
    }
    let rowArr = [{row:1, height: 25},{row:2, height: 5},{row:3, height: 45},{row:4, height: 50},];
    rowArr.map(item=>sheet.row(item.row).height(item.height));
    tableLetters.map(item=>sheet.column(item).width(16));
    sheet.range('A5:A16').merged(true).value(handleLevel4Score(tableData.officeAnnualScore)).style({fontSize: 12, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    sheet.range('D5:D16').merged(true).value(handleLevel4Score(tableData.childrenScore)).style({fontSize: 12, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    sheet.range('E5:E16').merged(true).value(handleLevel4Score(tableData.tacticsScore)).style({fontSize: 12, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    sheet.range('F5:F16').merged(true).value(handleLevel4Score(tableData.annualScore)).style({fontSize: 12, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    sheet.range(`A1:${tableLetters[tableLetters.length-1]}1`).merged(true).value(excelName).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center',});
    rangeArr.map(item=>sheet.range(item.range).merged(true).value(item.value).style({wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
    cellArr.map(item=>sheet.cell(item.cell).value(item.value).style({wrapText: true, border: item.border ,bold: item.bold, horizontalAlignment: item.horizontalAlignment ||'center',verticalAlignment: 'center', verticalText: item.verticalText}));
};
