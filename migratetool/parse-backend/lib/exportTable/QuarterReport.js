import {Letters, DailySection,OrgSequence} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'

const mapContent = ['年度驾驶训练','年度实车驾驶训练','年度实车驾驶','年度驾驶','汽车年度实车驾驶训练','汽车年度驾驶训练'];
const bulletStatLength=(tableData)=>{
    return tableData.bulletStat.length > 14 ? tableData.bulletStat.length : 14
};
const handlerMotorStat=(obj,key)=>{
    if(!obj || !obj.motorInfo || !obj.motorInfo.length)return '';
    const arr = obj.motorInfo.filter(item=>mapContent.includes(item.type));
    //const found = obj.motorInfo.find(item=>item.unitType === '公里');
    return arr[0] && (arr[0][key] + arr[0].unitType)
};
export const handleExportCallBack=(sheet, excelName, tableData)=> {
    let tableLetters = Letters.slice(0, 12);
    let rangeArr = [
        { range: 'A3:B3', value: `单位：${tableData.organization.displayName}`, horizontalAlignment: 'left'},
        { range: `${tableLetters[tableLetters.length-2]}3:${tableLetters[tableLetters.length-1]}3`, value: `时间：${CommonAPI.format(tableData.date,'YYYY年MM月')}`, horizontalAlignment: 'right'},
        { range: 'A4:B4', value: '训练内容', border: true, bold: true},
        { range: 'C4:D4', value: '训练质量', border: true, bold: true},
        { range: 'E4:J4', value: '训练时间', border: true, bold: true},
        { range: 'K4:L4', value: '教练员', border: true, bold: true},
        { range: 'A5:A6', value: '首长机关本\n季度训练内容', border: true,},
        { range: 'B5:B6', value: tableData.trainContent.join('\n'), border: true},
        { range: 'C5:C6', value: '首长机关\n年度训练\n成绩评定', border: true, },
        { range: 'D5:D6', value: CommonAPI.handlerLevel4Score(tableData.evaluatedScore), border: true},
        { range: 'E5:E6', value: '本季度\n集中训\n练天数', border: true, },
        { range: 'F5:F6', value: tableData.timeStatistic.trainDays, border: true,},
        { range: 'G5:G6', value: '首长机关\n季度训练\n时间（小时）', border: true, },
        { range: 'H5:H6', value: tableData.timeStatistic.trainHours, border: true,},
        { range: 'I5:I6', value: '首长机关\n累计训练\n时间（小时）', border: true, },
        { range: 'J5:J6', value: tableData.timeStatistic.totalHours, border: true,},
        { range: 'A7:D7', value: '训练场地', border: true, bold: true},
        { range: 'E7:L7', value: '训练弹药（手枪）', border: true, bold: true},
        { range: 'A8:A9', value: '达标\n单位数量', border: true},
        { range: 'B8:B9', value: tableData.placeStatistic.passNumber || '', border: true},
        { range: 'C8:C9', value: '达标率', border: true},
        { range: 'D8:D9', value: tableData.placeStatistic.passRate && `${tableData.placeStatistic.passRate}%` || '', border: true},
        { range: 'E8:H8', value: '首长机关季度消耗量（人均/总数）', border: true},
        { range: 'I8:L8', value: '首长机关累计消耗量（人均/总数）', border: true},
        { range: 'E9:H9', value: (tableData.bulletStatOffice.trainAverage && tableData.bulletStatOffice.train) && `${tableData.bulletStatOffice.trainAverage}/${tableData.bulletStatOffice.train}` || '', border: true},
        { range: 'I9:L9', value: (tableData.bulletStatOffice.totalTrainAverage && tableData.bulletStatOffice.totalTrain) && `${tableData.bulletStatOffice.totalTrainAverage}/${tableData.bulletStatOffice.totalTrain}` || '', border: true},
        { range: 'A10:D10', value: '全部队摩托（飞行）小时', border: true, bold: true},
        { range: 'E10:F11', value: '弹药类型\n（全部队）', border: true,},
        { range: 'G10:I10', value: '季度消耗量', border: true,},
        { range: 'J10:L10', value: '累计消耗量', border: true,},
        { range: 'A11:B11', value: '区分', border: true},
        { range: 'G11:H11', value: '本级训练', border: true},
        { range: 'J11:K11', value: '本级训练', border: true},
        { range: `A${12+bulletStatLength(tableData)}:B${12+bulletStatLength(tableData)}`, value: `填写人：${tableData.createdBy}`, horizontalAlignment: 'left'},
        { range: `K${12+bulletStatLength(tableData)}:L${12+bulletStatLength(tableData)}`, value: '审核人：', horizontalAlignment: 'right'},
    ];

    let cellArr = [
        { cell: 'K5', value: '达标\n单位数量', border: true},
        { cell: 'L5', value: tableData.trainerStatistic.passNumber|| '', border: true},
        { cell: 'K6', value: '平均\n达标率', border: true},
        { cell: 'L6', value: tableData.trainerStatistic.passRate && `${tableData.trainerStatistic.passRate}%` || '', border: true},
        { cell: 'I11', value: '其它', border: true},
        { cell: 'L11', value: '其它', border: true},
        { cell: 'C11', value: '本季度人均完成量', border: true},
        { cell: 'D11', value: '累计人均完成量', border: true},
    ];
    for(let i = 0; i< bulletStatLength(tableData); i++){
        sheet.range(`A${12+i}:B${12+i}`).value((tableData.motorStat[i]||{}).orgType || '　').merged(true).style({fontSize: 12, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
        sheet.cell(`C${12+i}`).value(handlerMotorStat(tableData.motorStat[i],'count')).style({fontSize: 12, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
        sheet.cell(`D${12+i}`).value(handlerMotorStat(tableData.motorStat[i],'total')).style({fontSize: 12, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
        sheet.range(`E${12+i}:F${12+i}`).value((tableData.bulletStat[i]||{}).type || '　').merged(true).style({fontSize: 12, fontFamily: '华文行楷',  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
        sheet.range(`G${12+i}:H${12+i}`).value((tableData.bulletStat[i])  && `${(tableData.bulletStat[i]||{}).trainAverage}/${(tableData.bulletStat[i]||{}).train}` || '').merged(true).style({ border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
        sheet.cell(`I${12+i}`).value((tableData.bulletStat[i]) ? tableData.bulletStat[i].others : '').style({  border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
        sheet.range(`J${12+i}:K${12+i}`).value((tableData.bulletStat[i]) && `${(tableData.bulletStat[i]||{}).totalTrainAverage}/${(tableData.bulletStat[i]||{}).totalTrain}` || '').merged(true).style({border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
        sheet.cell(`L${12+i}`).value((tableData.bulletStat[i]) ? tableData.bulletStat[i].totalOthers : '').style({ border: true,horizontalAlignment: 'center',verticalAlignment: 'center',});
    }
    let rowArr = [
        {row: 1, height: 25},
        {row: 2, height: 5},
        {row: 5, height: 30},
        {row: 6, height: 30},
        {row: 11, height: 30},
    ];
    for (let i=0; i< (bulletStatLength(tableData)+8); i++){sheet.row(4+i).height(370/(bulletStatLength(tableData)+8))}
    rowArr.map(item=>sheet.row(item.row).height(item.height));
    sheet.range(`A1:${tableLetters[tableLetters.length-1]}1`).merged(true).value(excelName).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center',});
    tableLetters.map(item=>sheet.column(item).width(11.1));
    rangeArr.map(item=>sheet.range(item.range).merged(true).value(item.value).style({wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
    cellArr.map(item=>sheet.cell(item.cell).value(item.value).style({wrapText: true, border: item.border , bold: item.bold,horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
};
