import {Letters, ScoreCriteria2} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'

const physicalShapes=(tableData)=>{
    return tableData && tableData.physicalShapes || []
};
const rowCount=(tableData)=>{
    return Math.max(Math.ceil(physicalShapes(tableData).length/2), 25)
};
const rowOne=(tableData)=>{
    return physicalShapes(tableData).slice(0, rowCount(tableData));
};
const rowTwo=(tableData)=>{
    return physicalShapes(tableData).slice(rowCount(tableData));
};
const scoreOptions=(tableData)=>{
    let found = Object.values(ScoreCriteria2).find(item=>item.name === tableData.scoreCriteria);
    if (!found) found = ScoreCriteria2.Level2;
    return found.optionalScores
};
const showRow=(index,row)=>{
    if(!row[index])return true;
    const personArr = [row[index],row[index-1]];
    const orgArr = personArr.map(item=>item && item.organization.objectId);
    return orgArr[0] !== orgArr[1]
};
const combineRow=(index,row, tableData)=>{
    if(!row[index])return 1;
    const orgName = row[index].organization.name;
    const calculate = (orgName,index,num = 1)=>{
        const is = row[index+1] && row[index+1].organization.name === orgName;
        return is ? calculate(orgName,index+1,num+1) : num;
    };
    const endLength = index+calculate(orgName,index);
    return endLength > rowCount(tableData) ? endLength - rowCount(tableData)+2 : calculate(orgName,index)
};
export const handleExportCallBack=(sheet, excelName, tableData)=>{
    let tableLetters = Letters.slice(0, 14);
    let rangeArr = [
        { range: 'A3:B3', value: '考核课目（内容）', border: true, bold: true},
        { range: 'C3:D3', value: '体型', border: true, bold: true},
        { range: 'F3:G3', value: CommonAPI.format(tableData.date), border: true, bold: true},
        { range: 'H3:I3', value: '考核形式', border: true, bold: true},
        { range: 'J3:N3', value: '普考', border: true, bold: true},
    ];
    let cellArr = [
        { cell: 'E3', value: '时间', border: true, bold: true},
        { cell: 'A4', value: '单位', border: true, bold: true},
        { cell: 'B4', value: '姓名', border: true, bold: true},
        { cell: 'C4', value: '身高cm', border: true, bold: true},
        { cell: 'D4', value: '体重kg', border: true, bold: true},
        { cell: 'E4', value: '体脂%', border: true, bold: true},
        { cell: 'F4', value: '体型', border: true, bold: true},
        { cell: 'G4', value: '成绩', border: true, bold: true},
        { cell: 'H4', value: '单位', border: true, bold: true},
        { cell: 'I4', value: '姓名', border: true, bold: true},
        { cell: 'J4', value: '身高cm', border: true, bold: true},
        { cell: 'K4', value: '体重kg', border: true, bold: true},
        { cell: 'L4', value: '体脂%', border: true, bold: true},
        { cell: 'M4', value: '体型', border: true, bold: true},
        { cell: 'N4', value: '成绩', border: true, bold: true},
    ];
    let [rowOneArr, rowOneValueArr, rowTwoArr, rowTwoValueArr] = [[], [], [], []];
    let rowHight = 680/(rowCount(tableData)+2);
    for(let i=0; i< (rowCount(tableData)+2); i++){
        if (i< rowCount(tableData)){
            sheet.cell(`B${5+i}`).value(rowOne(tableData)[i] && rowOne(tableData)[i].soldier.name || '　').style({fontSize: 8,wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`C${5+i}`).value(rowOne(tableData)[i] && rowOne(tableData)[i].height).style({fontSize: 8,wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`D${5+i}`).value(rowOne(tableData)[i] && rowOne(tableData)[i].weight).style({fontSize: 8,wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`E${5+i}`).value(rowOne(tableData)[i] && rowOne(tableData)[i].pbf).style({fontSize: 8,wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`F${5+i}`).value(rowOne(tableData)[i] && rowOne(tableData)[i].bmi).style({fontSize: 8,wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`G${5+i}`).value(rowOne(tableData)[i] && scoreOptions(tableData)[rowOne(tableData)[i].score] || '　').style({fontSize: 8,wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`I${5+i}`).value(rowTwo(tableData)[i] && rowTwo(tableData)[i].soldier.name || '　').style({fontSize: 8,wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`J${5+i}`).value(rowTwo(tableData)[i] && rowTwo(tableData)[i].height).style({fontSize: 8,wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`K${5+i}`).value(rowTwo(tableData)[i] && rowTwo(tableData)[i].weight).style({fontSize: 8,wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`L${5+i}`).value(rowTwo(tableData)[i] && rowTwo(tableData)[i].pbf).style({fontSize: 8,wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`M${5+i}`).value(rowTwo(tableData)[i] && rowTwo(tableData)[i].bmi).style({fontSize: 8,wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`N${5+i}`).value(rowTwo(tableData)[i] && scoreOptions(tableData)[rowTwo(tableData)[i].score] || '　').style({fontSize: 8,wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            if (showRow(i,rowOne(tableData)))rowOneArr.push({length: combineRow(i,rowOne(tableData), tableData), value: rowOne(tableData)[i] && rowOne(tableData)[i].organization.name || '　'});
            if (showRow(i,rowTwo(tableData)))rowTwoArr.push({length: combineRow(i,rowTwo(tableData), tableData), value: rowTwo(tableData)[i] && rowTwo(tableData)[i].organization.name || '　'});
        }
        sheet.row(i+3).height(rowHight);
    }
    rowOneValueArr = CommonAPI.handlerReduce(rowOneArr);
    rowTwoValueArr = CommonAPI.handlerReduce(rowTwoArr);
    rowOneValueArr.map(item=>{
        if (item[2].length === 1) sheet.cell(`A${5+item[0]}`).value(item[2].value).style({fontSize: 8,wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
        else {
            sheet.range(`A${5+item[0]}:A${4+item[1]}`).merged(true).value(item[2].value).style({fontSize: 8,wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
        }
    });
    rowTwoValueArr.map(item=>{
        if (item[2].length === 1) sheet.cell(`H${5+item[0]}`).value(item[2].value).style({fontSize: 8,wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
        else {
            sheet.range(`H${5+item[0]}:H${4+item[1]}`).merged(true).value(item[2].value).style({fontSize: 8,wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
        }
    });
    sheet.row(1).height(25);
    sheet.row(2).height(5);
    sheet.range(`A1:${tableLetters[tableLetters.length-1]}1`).merged(true).value(excelName).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center',});
    tableLetters.map(item=>{
        let width = 5;
        if (item === 'A' || item === 'H') width = 10;
        if (item === 'B' || item === 'G' || item === 'I' || item === 'N') width = 7;
        sheet.column(item).width(width)
    });
    rangeArr.map(item=>sheet.range(item.range).merged(true).value(item.value).style({fontSize: 8,wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
    cellArr.map(item=>sheet.cell(item.cell).value(item.value).style({fontSize: 8,wrapText: true, border: item.border , bold: item.bold, horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
};
