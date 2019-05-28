import {Letters, ScoreCriteria2} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'

const personScores=(tableData)=>{
    return tableData && tableData.personScores || []
};
const rowCount=(tableData)=>{
    return Math.max(Math.ceil(personScores(tableData).length/2), 25)
};

const rowOne=(tableData)=>{
    return personScores(tableData).slice(0,rowCount(tableData));
};

const rowTwo=(tableData)=>{
    return personScores(tableData).slice(rowCount(tableData));
};

const fourStage=(tableData)=>{
    return tableData.scoreSriteria === '四级制'
};

const combineRow=(index,row, tableData)=>{
    if(!row[index])return 1;
    const orgName = row[index].organization.objectId;
    const calculate = (orgName,index,num = 1)=>{
        const is = row[index+1] && row[index+1].organization.objectId === orgName;
        return is ? calculate(orgName,index+1,num+1) : num;
    };
    const endLength = index+calculate(orgName,index);
    return endLength > rowCount(tableData) ? endLength - rowCount(tableData)+2 : calculate(orgName,index)
};

const showRow=(index,row)=>{
    if(!row[index])return true;
    const personArr = [row[index],row[index-1]];
    const orgArr = personArr.map(item=>item && item.organization.objectId);
    return orgArr[0] !== orgArr[1]
};

const scoreOptions=(tableData)=>{
    const found = Object.values(ScoreCriteria2).find(item=>item.name === tableData.scoreSriteria);
    return found.optionalScores
};
export const handleExportCallBack=(sheet, excelName, tableData)=> {
    let tableLetters = Letters.slice(0,8);
    let rangeArr = [
        { range: 'A3:B3', value: '考核课目（内容）', border: true, bold: true},
        { range: 'C3:H3', value: tableData.testContent?`${tableData.courseName}（${tableData.testContent}）`:tableData.courseName,border: true, bold: true},
        { range: 'A4:B4', value: '时间', border: true, bold: true},
        { range: 'C4:D4', value: CommonAPI.format(tableData.date), border: true, bold: true},
        { range: 'E4:F4', value: '考核形式', border: true, bold: true},
        { range: 'G4:H4', value: tableData.assessMethod, border: true, bold: true},
        { range: `A${rowCount(tableData)+5}:A${rowCount(tableData)+9}`, value: '成绩\n统计', border: true,},
        { range: `B${rowCount(tableData)+5}:E${rowCount(tableData)+5}`, value: '按四级制评定', border: true,},
        { range: `F${rowCount(tableData)+5}:H${rowCount(tableData)+5}`, value: '按二级制评定', border: true,},
        { range: `F${rowCount(tableData)+6}:G${rowCount(tableData)+6}`, value: '合  格\n人  数', border: true,},
        { range: `F${rowCount(tableData)+7}:G${rowCount(tableData)+7}`, value: !fourStage(tableData) && (tableData.passCount+'')||'', border: true,},
        { range: `F${rowCount(tableData)+8}:G${rowCount(tableData)+8}`, value: '合格率', border: true,},
        { range: `F${rowCount(tableData)+9}:G${rowCount(tableData)+9}`, value: !fourStage(tableData) && (tableData.passRate+'%')||'', border: true,},
        { range: `D${rowCount(tableData)+10}:E${rowCount(tableData)+10}`, value: '填写人：', },
        { range: `G${rowCount(tableData)+10}:H${rowCount(tableData)+10}`, value: CommonAPI.format(tableData.date), horizontalAlignment: 'right'},
    ];
    let cellArr = [
        {cell: 'A5', value: '单位', border: true, bold: true},
        {cell: 'B5', value: '姓名', border: true, bold: true},
        {cell: 'C5', value: '职务', border: true, bold: true},
        {cell: 'D5', value: '成绩', border: true, bold: true},
        {cell: 'E5', value: '单位', border: true, bold: true},
        {cell: 'F5', value: '姓名', border: true, bold: true},
        {cell: 'G5', value: '职务', border: true, bold: true},
        {cell: 'H5', value: '成绩', border: true, bold: true},
        {cell: `B${rowCount(tableData)+6}`, value: '优  秀\n人  数', border: true},
        {cell: `C${rowCount(tableData)+6}`, value: '良  好\n人  数', border: true},
        {cell: `D${rowCount(tableData)+6}`, value: '及  格\n人  数', border: true},
        {cell: `E${rowCount(tableData)+6}`, value: '不及格\n人  数', border: true},
        {cell: `H${rowCount(tableData)+6}`, value: '不合格\n人  数', border: true },
        {cell: `B${rowCount(tableData)+7}`, value: fourStage(tableData) && (tableData.excellentCount+'')||'', border: true},
        {cell: `C${rowCount(tableData)+7}`, value: fourStage(tableData) && (tableData.goodCount+'')||'',  border: true},
        {cell: `D${rowCount(tableData)+7}`, value: fourStage(tableData) && (tableData.passCount+'')||'',  border: true},
        {cell: `E${rowCount(tableData)+7}`, value: fourStage(tableData) && (tableData.unpassCount+'')||'', border: true},
        {cell: `H${rowCount(tableData)+7}`, value: !fourStage(tableData) && (tableData.unpassCount+'')||'', border: true},
        {cell: `B${rowCount(tableData)+8}`, value: '优秀率', border: true},
        {cell: `C${rowCount(tableData)+8}`, value: '优良率', border: true},
        {cell: `D${rowCount(tableData)+8}`, value: '及格率', border: true},
        {cell: `E${rowCount(tableData)+8}`, value: '成  绩\n评  定', border: true},
        {cell: `H${rowCount(tableData)+8}`, value: '成  绩\n评  定', border: true},
        {cell: `B${rowCount(tableData)+9}`, value: fourStage(tableData) && (tableData.excellentRate + '%')||'', border: true},
        {cell: `C${rowCount(tableData)+9}`, value: fourStage(tableData) && (tableData.goodRate + '%')||'', border: true},
        {cell: `D${rowCount(tableData)+9}`, value: fourStage(tableData) && (tableData.passRate + '%')||'', border: true},
        {cell: `E${rowCount(tableData)+9}`, value: fourStage(tableData) && scoreOptions(tableData)[tableData.score]||'', border: true},
        {cell: `H${rowCount(tableData)+9}`, value: !fourStage(tableData) && scoreOptions(tableData)[tableData.score]||'', border: true},
        {cell: `A${rowCount(tableData)+10}`, value: '审核人：',},

    ];
    let [rowOneOrg, rowTwoOrg, rowOneOrgValue, rowTwoOrgValue] = [[], [], [], []];
    let rowHight = 660/(rowCount(tableData)+7);
    for(let i=0; i< rowCount(tableData)+8; i ++){
        if (i< rowCount(tableData)){
            sheet.cell(`B${6+i}`).value(rowOne(tableData)[i] &&rowOne(tableData)[i].soldier.name || '　').style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',})
            sheet.cell(`C${6+i}`).value(rowOne(tableData)[i] && rowOne(tableData)[i].soldier.position || '　').style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',})
            sheet.cell(`D${6+i}`).value(rowOne(tableData)[i] && scoreOptions(tableData)[rowOne(tableData)[i].score] || '　').style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',})
            sheet.cell(`F${6+i}`).value(rowTwo(tableData)[i] && rowTwo(tableData)[i].soldier.name || '　').style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',})
            sheet.cell(`G${6+i}`).value(rowTwo(tableData)[i] && rowTwo(tableData)[i].soldier.position || '　').style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',})
            sheet.cell(`H${6+i}`).value(rowTwo(tableData)[i] && scoreOptions(tableData)[rowTwo(tableData)[i].score] || '　').style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',})
            if (showRow(i,rowOne(tableData))) rowOneOrg.push({length: combineRow(i, rowOne(tableData), tableData), value: rowOne(tableData)[i] && rowOne(tableData)[i].organization.name || '　'});
            if (showRow(i,rowTwo(tableData))) rowTwoOrg.push({length: combineRow(i, rowTwo(tableData), tableData), value: rowTwo(tableData)[i] && rowTwo(tableData)[i].organization.name || '　'});
        }
        sheet.row(i+3).height(rowHight);
    }
    rowOneOrgValue = CommonAPI.handlerReduce(rowOneOrg);
    rowTwoOrgValue = CommonAPI.handlerReduce(rowTwoOrg);
    rowOneOrgValue.map(item=>{
        if (item[2].length === 1) sheet.cell(`A${6+item[0]}`).value(item[2].value).style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
        else {
            sheet.range(`A${6+item[0]}:A${5+item[1]}`).merged(true).value(item[2].value).style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
        }
    });
    rowTwoOrgValue.map(item=>{
        if (item[2].length === 1) sheet.cell(`E${6+item[0]}`).value(item[2].value).style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
        else {
            sheet.range(`E${6+item[0]}:E${5+item[1]}`).merged(true).value(item[2].value).style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
        }
    });
    sheet.row(1).height(25);
    sheet.row(2).height(5);
    sheet.range(`A1:${tableLetters[tableLetters.length-1]}1`).merged(true).value(excelName).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center',});
    tableLetters.map(item=>sheet.column(item).width(11));
    rangeArr.map(item=>sheet.range(item.range).merged(true).value(item.value).style({wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
    cellArr.map(item=>sheet.cell(item.cell).value(item.value).style({wrapText: true, border: item.border , horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
};
