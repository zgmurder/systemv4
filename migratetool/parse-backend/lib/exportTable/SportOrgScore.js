import {Letters, ScoreCriteria} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'
import _ from 'lodash'

const handleStats=(key,value)=>{
    switch (key){
        case 'extraL1Count':
            return `特1级：${value}`;
        case 'extraL2Count':
            return `特2级：${value}`;
        case 'extraL3Count':
            return `特3级：${value}`;
        case 'excellentCount':
            return `优秀：${value}`;
        case 'goodCount':
            return `良好：${value}`;
        case 'passCount':
            return `及格：${value}`;
        case 'unpassCount':
            return `不及格：${value}`;
        case 'excellentRate':
            return `优秀率：${value||0}%`;
        case 'goodRate':
            return `良好率：${value||0}%`;
        case 'passRate':
            return `及格率：${value||0}%`;
    }
};
const level4=()=>{
    const arr = _.cloneDeep(ScoreCriteria.Level4.optionalScores);
    return arr.reverse();
};
const handleLevel7Score=(Score)=>{
    return ScoreCriteria.Level7.optionalScores[Score-1]
};
const comLength=(tableData)=>{
    return tableData.personScores.length < 14 ? 14 : tableData.personScores.length+1
};
export const handleExportCallBack=(sheet, excelName, tableData)=> {
    let tableLetters = Letters.slice(0, 6);
    let tableNotes =
        '1.本表由普考组织单位填写，所填写对象均为本单位的普考对象；\n' +
        '2.各级单位的年度军事体育训练成绩均依据上述普考成绩计算；\n' +
        '3.及格率、良好率、优秀率分别为及格、良好、优秀人数除以参考人数（特级以上人员计入优秀人数）';
    let tableStatsValue = [];
    let level4Value = [];
    Object.keys(tableData.stats).forEach(key=>(handleStats(key,tableData.stats && tableData.stats[key]))&& tableStatsValue.push(handleStats(key,tableData.stats && tableData.stats[key])));
    level4().map((item, index)=>{
        level4Value.push(`${item}${(tableData.evaluatedScore === level4().length-index) && '☑' || '☐'}`);
    });
    let rangeArr = [
        {range: `B${4+comLength(tableData)}:F${4+comLength(tableData)}`, value: tableNotes, border: true, textAlign: 'left'},
        {range: `E4:E${3+comLength(tableData)}`, value: tableStatsValue.join('\n'), border: true},
        {range: `F4:F${3+comLength(tableData)}`, value: level4Value.join('\n'), border: true},
    ];
    let cellArr = [
        {cell: 'A3', value: '序号', bold: true, border: true},
        {cell: 'B3', value: '姓名', bold: true, border: true},
        {cell: 'C3', value: '职务', bold: true, border: true},
        {cell: 'D3', value: '个人总评', bold: true, border: true},
        {cell: 'E3', value: '单位评定指标', bold: true, border: true},
        {cell: 'F3', value: '单位总评', bold: true, border: true},
        {cell: `A${4+comLength(tableData)}`, value: '备注', border: true}
    ];
    let rowHeight = 580/comLength(tableData);
    let rowArr = [
        {row: 1, height: 25},
        {row: 3, height: rowHeight},
        {row: 4+comLength(tableData), height: 60},
    ];
    for(let i = 0; i < comLength(tableData); i++){
        if (i <6) sheet.column(tableLetters[i]).width(tableLetters[i] === 'A' && 10.5 || 15.8);
        sheet.row(i+4).height(rowHeight);
        sheet.cell(`A${4+i}`).value(tableData.personScores[i] && i+1 || '').style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
        sheet.cell(`B${4+i}`).value(tableData.personScores[i] && tableData.personScores[i].name || '').style({fontSize: 12, fontFamily: '华文行楷', wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
        sheet.cell(`C${4+i}`).value(tableData.personScores[i] && tableData.personScores[i].position || '').style({fontSize: 12,fontFamily: '华文行楷', wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
        sheet.cell(`D${4+i}`).value(tableData.personScores[i] && handleLevel7Score(tableData.personScores[i].score) || '').style({fontSize: 12,fontFamily: '华文行楷', wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
    }
    rowArr.map(item=>sheet.row(item.row).height(item.height));
    sheet.range(`A1:${tableLetters[tableLetters.length-1]}1`).value(excelName).merged(true).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center',});
    rangeArr.map(item=>sheet.range(item.range).merged(true).value(item.value).style({fontSize: 10,wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: item.textAlign || 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
    cellArr.map(item=>sheet.cell(item.cell).value(item.value).style({fontSize: 10,wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: item.textAlign || 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
};
