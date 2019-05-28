import {Letters, ScoreCriteria2} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'

const repairTableLength=(tableData)=>{
    if(!tableData)return {};
    const len = tableData.courseScores.length;
    return len > 33 ? tableData.courseScores.length : Math.abs(tableData.courseScores.length-33)
};
const handleScoreSriteria=(score,criteria='四级制')=>{
    const found = Object.values(ScoreCriteria2).find(item=>item.name === criteria);
    return found.optionalScores[score]
};
export const handleExportCallBack=(sheet, excelName, tableData)=> {
    let tableLetters = Letters.slice(0,6);
    let rangeArr = [
        { range: 'A3:A4', value: '课目', border: true, bold: true},
        { range: 'B3:C3', value: '成绩', border: true, bold: true},
        { range: 'D3:D4', value: '年度训练\n成绩', border: true, bold: true},
        { range: 'E3:E4', value: '优秀\n教练员\n参谋', border: true, bold: true},
        { range: 'F3:F4', value: '比武\n竞赛', border: true, bold: true},
        { range: `E${repairTableLength(tableData)+4+tableData.courseScores.length}:F${repairTableLength(tableData)+4+tableData.courseScores.length}`, value: CommonAPI.format(tableData.date),horizontalAlignment:'right'},
    ];
    let cellArr = [
        { cell: 'B4', value: '两级制', border: true, bold: true},
        { cell: 'C4', value: '四级制', border: true, bold: true},
        { cell: `A${repairTableLength(tableData)+4+tableData.courseScores.length}`, value: '审核人：', horizontalAlignment:'left'},
        { cell: `C${repairTableLength(tableData)+4+tableData.courseScores.length}`, value: '填写人：', horizontalAlignment:'left'},
    ];
    const rowHeight = 670/(repairTableLength(tableData)+1+tableData.courseScores.length);
    for(let i=0; i< (repairTableLength(tableData)+1+tableData.courseScores.length); i ++){
        if (i<(repairTableLength(tableData)+tableData.courseScores.length-1)){
            let item = tableData.courseScores[i];
            sheet.cell(`A${5+i}`).value(item && item.name || '').style({fontSize: 12, fontFamily: '华文行楷',border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`B${5+i}`).value(item && (item.criteria === '二级制' && handleScoreSriteria(item.score,item.criteria)||'') || '').style({fontSize: 12, fontFamily: '华文行楷',border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`C${5+i}`).value(item && (item.criteria === '四级制' && handleScoreSriteria(item.score,item.criteria)||'') || '').style({fontSize: 12, fontFamily: '华文行楷',border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
        }
        sheet.row(4+i).height(rowHeight);
    }
    sheet.row(1).height(25);
    sheet.cell('A2').value(`姓名：${tableData.name}  职务：${tableData.position}`).style({horizontalAlignment: 'left',verticalAlignment: 'center',});
    sheet.range(`D5:D${repairTableLength(tableData)+3+tableData.courseScores.length}`).merged(true).value(handleScoreSriteria(tableData.score)).style({fontSize: 12, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    sheet.range(`E5:E${repairTableLength(tableData)+3+tableData.courseScores.length}`).merged(true).value(tableData.excellentTrainer ? '是' : '否').style({fontSize: 12, fontFamily: '华文行楷', border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    sheet.range(`F5:F${repairTableLength(tableData)+3+tableData.courseScores.length}`).merged(true).value(tableData.competitions.join('\n')).style({fontSize: 12, fontFamily: '华文行楷', border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    sheet.range(`A1:${tableLetters[tableLetters.length-1]}1`).merged(true).value(excelName).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center',});
    tableLetters.map(item=>sheet.column(item).width(item==='A' && 29 || 12));
    rangeArr.map(item=>sheet.range(item.range).merged(true).value(item.value).style({wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
    cellArr.map(item=>sheet.cell(item.cell).value(item.value).style({wrapText: true, border: item.border ,bold: item.bold, horizontalAlignment: item.horizontalAlignment ||'center',verticalAlignment: 'center', verticalText: item.verticalText}));
};
