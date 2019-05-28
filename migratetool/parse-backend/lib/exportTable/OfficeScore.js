import {Letters, ScoreCriteria2} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'

const scoreOptions=(tableData)=>{
    const found = Object.values(ScoreCriteria2).find(item=>item.name === (tableData.scoreSriteria||'四级制'));
    return found.optionalScores
};
const personScores=(tableData)=>{
    return tableData && tableData.personScores || []
};
export const handleExportCallBack=(sheet, excelName, tableData)=> {
    let tableLetters = Letters.slice(0, 7);
    let rangeArr = [
        { range: 'A3:D3', value: '机关个人年度训练成绩', border: true, bold: true},
        { range: 'E3:E4', value: '战术（战役）\n作业成绩', border: true, bold: true},
        { range: 'F3:F4', value: '指挥所\n演习成绩', border: true, bold: true},
        { range: 'G3:G4', value: '年度训练成绩', border: true, bold: true},
        { range: 'F30:G30', value: CommonAPI.format(tableData.date), horizontalAlignment: 'right'},
    ];
    let cellArr = [
        { cell: 'A4', value: '姓名', border: true, bold: true},
        { cell: 'B4', value: '职务', border: true, bold: true},
        { cell: 'C4', value: '成绩', border: true, bold: true},
        { cell: 'D4', value: '成绩评定', border: true, bold: true},
        { cell: 'A30', value: '审核人：', horizontalAlignment: 'left'},
        { cell: 'D30', value: '填写人：', },
    ];
    for(let i = 0; i<27; i ++){
        if (i<25){
            sheet.cell(`A${i+5}`).value(personScores(tableData)[i] && personScores(tableData)[i].name|| '　').style({fontSize: 12, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`B${i+5}`).value(personScores(tableData)[i] && personScores(tableData)[i].position|| '　').style({fontSize: 12, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`C${i+5}`).value(personScores(tableData)[i] && scoreOptions(tableData)[personScores(tableData)[i].score]|| '　').style({fontSize: 12, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
        }
        sheet.row(i+4).height(24.3);
    }
    sheet.row(1).height(25);
    sheet.row(3).height(30);
    tableLetters.map(item=>sheet.column(item).width(12.6));
    sheet.range('D5:D29').merged(true).value(scoreOptions(tableData)[tableData.childrenScore]).style({fontSize: 12, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    sheet.range('E5:E29').merged(true).value(scoreOptions(tableData)[tableData.tacticsScore]).style({fontSize: 12, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    sheet.range('F5:F29').merged(true).value(scoreOptions(tableData)[tableData.exerciseScore]).style({fontSize: 12, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    sheet.range('G5:G29').merged(true).value(scoreOptions(tableData)[tableData.annualScore]).style({fontSize: 12, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    sheet.range(`A1:${tableLetters[tableLetters.length-1]}1`).merged(true).value(excelName).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center',});
    rangeArr.map(item=>sheet.range(item.range).merged(true).value(item.value).style({fontSize: 10,wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
    cellArr.map(item=>sheet.cell(item.cell).value(item.value).style({fontSize: 10,wrapText: true, border: item.border ,bold: item.bold, horizontalAlignment: item.horizontalAlignment ||'center',verticalAlignment: 'center', verticalText: item.verticalText}));
};
