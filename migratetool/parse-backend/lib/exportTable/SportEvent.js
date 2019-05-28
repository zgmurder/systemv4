import {Letters, DailySection,OrgSequence, ScoreCriteria2} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'

const timeToString=(value,tableData)=> {
    let countType = tableData.course.countType;
    if(!value)return '　';
    switch (countType) {
        case '数量':
            return value;
        case '时间':
            if (!value) return value;
            const integer = parseInt(value);
            const float = +(value - integer).toFixed(2);
            return Math.floor(integer / 60) + "' " + (integer % 60 ) + '"' + (float ? (float*10).toFixed(0):'');
        default:
            return ScoreCriteria2.Level4.optionalScores[value]
    }
};
const handleScore=(Score,scoreSriteria)=>{
    const found = Object.values(ScoreCriteria2).find(item=>item.name === scoreSriteria);
    return found.optionalScores ? found.optionalScores[Score] : Score;
};
const sportScores=(tableData)=>{
    tableData && tableData.sportScores.forEach(item=>{
        if(item.count){
            const integer = (+item.count).toFixed(0);
            const float = +(item.count - integer).toFixed(2);
            item.minute = Math.floor(integer / 60);
            item.second = integer % 60 + float;
            // this.$set(item,'minute',Math.floor(integer / 60));
            // this.$set(item,'second',integer % 60 + float);
        }else {
            item.minute ='';
            item.second = '';
            // this.$set(item,'minute','');
            // this.$set(item,'second','');
        }
    });
    return tableData && tableData.sportScores || []
};
const rowCount=(tableData)=>{
    return Math.max(Math.ceil(sportScores(tableData).length/2), 25)
};
const rowOne=(tableData)=>{
    return sportScores(tableData).slice(0,rowCount(tableData));
};
const rowTwo=(tableData)=>{
    return sportScores(tableData).slice(rowCount(tableData));
};
const combineRow=(index,row, tableData)=>{
    if(!row[index])return 1;

    const orgName = row[index].displayOrg?row[index].displayOrg.name:row[index].organization.name;
    const calculate = (orgName,index,num = 1)=>{
        const is = row[index+1] && (row[index+1].displayOrg?row[index+1].displayOrg.name:row[index+1].organization.name) === orgName;
        return is ? calculate(orgName,index+1,num+1) : num;
    };
    const endLength = index+calculate(orgName,index);
    return endLength > rowCount(tableData) ? endLength - rowCount(tableData)+2 : calculate(orgName,index)
};
const showRow=(index,row)=>{
    if(!row[index])return true;
    const personArr = [row[index],row[index-1]];
    const orgArr = personArr.map(item=>item && (item.displayOrg?item.displayOrg.objectId:item.organization.objectId));
    return orgArr[0] !== orgArr[1]
};
export const handleExportCallBack=(sheet, excelName, tableData)=> {
    let tableLetters = Letters.slice(0, 10);
    let rangeArr = [
        { range: 'A3:B3', value: '组织单位', border: true, bold: true},
        { range: 'A4:B4', value: '考核课目（内容）', border: true, bold: true},
        { range: 'A5:B5', value: '时间', border: true, bold: true},
        { range: 'C3:E3', value: tableData.organizer.displayName, border: true, bold: true},
        { range: 'F3:G3', value: '考核单位', border: true, bold: true},
        { range: 'H3:J3', value: tableData.organization.displayName, border: true, bold: true},
        { range: 'C4:J4', value: tableData.courseName, border: true, bold: true},
        { range: 'C5:E5', value: CommonAPI.format(tableData.date), border: true, bold: true},
        { range: 'F5:G5', value: '考核形式', border: true, bold: true},
        { range: 'H5:J5', value: tableData.assessMethod, border: true, bold: true},
        { range: `E${7+rowCount(tableData)}:F${7+rowCount(tableData)}`, value: '填写人：'},
        { range: `I${7+rowCount(tableData)}:J${7+rowCount(tableData)}`, value: CommonAPI.format(tableData.date), horizontalAlignment: 'right'},
    ];
    let cellArr = [
        { cell: 'A6', value: '单位', border: true, bold: true},
        { cell: 'B6', value: '姓名', border: true, bold: true},
        { cell: 'C6', value: '职务', border: true, bold: true},
        { cell: 'D6', value: '评分', border: true, bold: true},
        { cell: 'E6', value: tableData.course.unitType && `成绩（${tableData.course.unitType}）` || '成绩', border: true, bold: true},
        { cell: 'F6', value: '单位', border: true, bold: true},
        { cell: 'G6', value: '姓名', border: true, bold: true},
        { cell: 'H6', value: '职务', border: true, bold: true},
        { cell: 'I6', value: '评分', border: true, bold: true},
        { cell: 'J6', value: tableData.course.unitType && `成绩（${tableData.course.unitType}）` || '成绩', border: true, bold: true},
        { cell: `A${7+rowCount(tableData)}`, value: '审核人:', horizontalAlignment: 'left'},
    ];
    let [rowOneArr, rowOneValueArr, rowTwoArr, rowTwoValueArr] = [[], [], [], []];
    for(let i =0; i< (rowCount(tableData)+4); i++){
        if (i< rowCount(tableData)){
            sheet.cell(`B${i+7}`).value(rowOne(tableData)[i] && rowOne(tableData)[i].soldier.name || '　').style({wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`C${i+7}`).value(rowOne(tableData)[i] && rowOne(tableData)[i].soldier.position || '　').style({wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`D${i+7}`).value(rowOne(tableData)[i] && handleScore(rowOne(tableData)[i].score,rowOne(tableData)[i].scoreCriteria)).style({wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`E${i+7}`).value(timeToString(rowOne(tableData)[i] && rowOne(tableData)[i].count, tableData)).style({wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`G${i+7}`).value(rowTwo(tableData)[i] && rowTwo(tableData)[i].soldier.name || '　').style({wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`H${i+7}`).value(rowTwo(tableData)[i] && rowTwo(tableData)[i].soldier.position || '　').style({wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`I${i+7}`).value(rowTwo(tableData)[i] && handleScore(rowTwo(tableData)[i].score,rowTwo(tableData)[i].scoreCriteria)).style({wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`J${i+7}`).value(timeToString(rowTwo(tableData)[i] && rowTwo(tableData)[i].count, tableData)).style({wrapText: true,  border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
            if (showRow(i,rowOne(tableData))) rowOneArr.push({length: combineRow(i, rowOne(tableData), tableData), value: rowOne(tableData)[i] && (rowOne(tableData)[i].displayOrg||rowOne(tableData)[i].organization).name || '　'});
            if (showRow(i,rowTwo(tableData))) rowTwoArr.push({length: combineRow(i, rowTwo(tableData), tableData), value: rowTwo(tableData)[i] && (rowTwo(tableData)[i].displayOrg||rowTwo(tableData)[i].organization).name || '　'});
        }
        sheet.row(i+3).height(670/(rowCount(tableData)+4));
    }
    rowOneValueArr = CommonAPI.handlerReduce(rowOneArr);
    rowTwoValueArr = CommonAPI.handlerReduce(rowTwoArr);
    rowOneValueArr.map(item=>{
        if (item[2].length === 1) sheet.cell(`A${7+item[0]}`).value(item[2].value).style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
        else {
            sheet.range(`A${7+item[0]}:A${6+item[1]}`).merged(true).value(item[2].value).style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
        }
    });
    rowTwoValueArr.map(item=>{
        if (item[2].length === 1) sheet.cell(`F${7+item[0]}`).value(item[2].value).style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
        else {
            sheet.range(`F${7+item[0]}:F${6+item[1]}`).merged(true).value(item[2].value).style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
        }
    });
    sheet.row(1).height(25);
    sheet.row(2).height(5);
    sheet.range(`A1:${tableLetters[tableLetters.length-1]}1`).merged(true).value(excelName).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center',});
    tableLetters.map(item=>sheet.column(item).width(8.8));
    rangeArr.map(item=>sheet.range(item.range).merged(true).value(item.value).style({wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
    cellArr.map(item=>sheet.cell(item.cell).value(item.value).style({wrapText: true, border: item.border , horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
};
