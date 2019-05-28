import {Letters, PersonProperty} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'

const handlerZero=(num)=>{
    if (isNaN(num)) return '';
    return +num === 0 ? '' : +num
};

const bulletStatLength=(tableData)=>{
    return tableData.bulletStat.length > 9 ? tableData.bulletStat.length : 9
};

const handlerPersonProperty=(key)=>{
    return PersonProperty[key]?PersonProperty[key]:key
};

export const handleExportCallBack=(sheet, excelName, tableData)=>{
    let tableLetters = Letters.slice(0, 12);
    let rangeArr = [
        { range: 'A3:C3', value: `单位：${tableData.targetOrg.displayName}`, bold: true, horizontalAlignment: 'left'},
        { range: 'A4:E4', value: '训练时间', border: true, bold: true},
        { range: 'F4:L4', value: '训练时间', border: true, bold: true},
        { range: 'A5:A6', value: '区分', border: true},
        { range: 'B5:C5', value: '本月训练时间', border: true},
        { range: 'D5:E5', value: '累积训练时间', border: true},
        { range: 'F5:F6', value: '优秀率（%）', border: true},
        { range: 'G5:H6', value: '优良率（%）', border: true},
        { range: 'I5:K6', value: '及格率（%）', border: true},
        { range: 'L5:L6', value: '成绩评定', border: true},
        { range: `G7:H${6+tableData.timeStat.length}`, value: handlerZero(tableData.qualityStat.goodRate), border: true},
        { range: `I7:K${6+tableData.timeStat.length}`, value: handlerZero(tableData.qualityStat.passRate), border: true},
        { range: `A${7+tableData.timeStat.length}:E${7+tableData.timeStat.length}`, value: '教练员', border: true, bold: true},
        { range: `F${7+tableData.timeStat.length}:L${7+tableData.timeStat.length}`, value: '训练场地', border: true, bold: true},
        { range: `G${8+tableData.timeStat.length}:H${8+tableData.timeStat.length}`, value: '未建场地名称', border: true},
        { range: `I${8+tableData.timeStat.length}:K${8+tableData.timeStat.length}`, value: '新建场地名称', border: true},
        { range: `G${9+tableData.timeStat.length}:H${9+tableData.timeStat.length}`, value: (tableData.placeStatistic||{}).nonCreated.join(','), border: true,fontSize: 13, fontFamily: '华文行楷',},
        { range: `I${9+tableData.timeStat.length}:K${9+tableData.timeStat.length}`, value: (tableData.placeStatistic||{}).newCreated.join(','), border: true,fontSize: 13, fontFamily: '华文行楷',},
        { range: `A${10+tableData.timeStat.length}:E${10+tableData.timeStat.length}`, value: '摩托（飞行）小时', border: true, bold: true},
        { range: `F${10+tableData.timeStat.length}:L${10+tableData.timeStat.length}`, value: '训练弹药', border: true, bold: true},
        { range: `A${11+tableData.timeStat.length}:C${12+tableData.timeStat.length}`, value: '区分', border: true},
        { range: `D${11+tableData.timeStat.length}:D${12+tableData.timeStat.length}`, value: '本月人均完成量', border: true},
        { range: `E${11+tableData.timeStat.length}:E${12+tableData.timeStat.length}`, value: '累积人均完成量', border: true},
        { range: `F${11+tableData.timeStat.length}:F${12+tableData.timeStat.length}`, value: '弹药类型', border: true},
        { range: `G${11+tableData.timeStat.length}:I${11+tableData.timeStat.length}`, value: '本月消耗量', border: true},
        { range: `J${11+tableData.timeStat.length}:L${11+tableData.timeStat.length}`, value: '累积消耗量', border: true},
        { range: `G${12+tableData.timeStat.length}:H${12+tableData.timeStat.length}`, value: '本级训练\n(人均/总数)', border: true},
        { range: `J${12+tableData.timeStat.length}:K${12+tableData.timeStat.length}`, value: '本级训练\n(人均/总数)', border: true},
        { range: `A${bulletStatLength(tableData) + 13+tableData.timeStat.length}:B${bulletStatLength(tableData) + 13+tableData.timeStat.length}`, value: `填写人:${tableData.createdBy}`, horizontalAlignment: 'left'},
        { range: 'H3:L3', value: `时间：${CommonAPI.format(tableData.date,'YYYY年MM月')}`,  horizontalAlignment: 'right'},
    ];
    let cellArr = [
        { cell: 'B6', value: '昼', border: true},
        { cell: 'C6', value: '夜', border: true},
        { cell: 'D6', value: '昼', border: true},
        { cell: 'E6', value: '夜', border: true},
        { cell: `A${8+tableData.timeStat.length}`, value: '干部数量', border: true},
        { cell: `B${8+tableData.timeStat.length}`, value: '班长数量', border: true},
        { cell: `C${8+tableData.timeStat.length}`, value: '其他\n教练员数量', border: true},
        { cell: `D${8+tableData.timeStat.length}`, value: '"四会"\n达标数量', border: true},
        { cell: `E${8+tableData.timeStat.length}`, value: '"四会"\n达标率（%）', border: true},
        { cell: `F${8+tableData.timeStat.length}`, value: '已建场地名称', border: true},
        { cell: `L${8+tableData.timeStat.length}`, value: '达标率（%）', border: true},
        { cell: `A${9+tableData.timeStat.length}`, value: handlerZero(tableData.trainerStatistic.officerCount), border: true},
        { cell: `B${9+tableData.timeStat.length}`, value: handlerZero(tableData.trainerStatistic.monitorCount), border: true},
        { cell: `C${9+tableData.timeStat.length}`, value: handlerZero(tableData.trainerStatistic.otherCount), border: true},
        { cell: `D${9+tableData.timeStat.length}`, value: handlerZero(tableData.trainerStatistic.standardCount), border: true},
        { cell: `E${9+tableData.timeStat.length}`, value: handlerZero(tableData.trainerStatistic.standardRate), border: true},
        { cell: `F${9+tableData.timeStat.length}`, value: (tableData.placeStatistic||{}).created.join(','), border: true,fontSize: 13, fontFamily: '华文行楷',},
        { cell: `L${9+tableData.timeStat.length}`, value: handlerZero((tableData.placeStatistic||{}).passRate), border: true},
        { cell: `I${12+tableData.timeStat.length}`, value: '其他', border: true},
        { cell: `L${12+tableData.timeStat.length}`, value: '其他', border: true},
        { cell: `L${bulletStatLength(tableData) + 13+tableData.timeStat.length}`, value: '中队主官：'}
    ];
    if (tableData.timeStat.length>1){
        rangeArr.push(
            { range: `F7:F${6+tableData.timeStat.length}`, value: handlerZero(tableData.qualityStat.excellentRate), border: true},
            { range: `L7:L${6+tableData.timeStat.length}`, value: CommonAPI.handlerLevel4Score(tableData.qualityStat.evaluatedScore), border: true,fontSize: 13, fontFamily: '华文行楷',},)
    }  else {
        cellArr.push(
            { cell: 'F7', value: handlerZero(tableData.qualityStat.excellentRate), border: true},
            { cell: 'L7', value: CommonAPI.handlerLevel4Score(tableData.qualityStat.evaluatedScore), border: true,fontSize: 13, fontFamily: '华文行楷',},
        )
    }
    for (let index = 0; index< bulletStatLength(tableData); index ++){
        sheet.range(`A${13+index+tableData.timeStat.length}:C${13+index+tableData.timeStat.length}`).merged(true).value((tableData.motorStat[index]||{}).type || '　').style({fontSize: 13, fontFamily: '华文行楷',wrapText: true, border: true ,  horizontalAlignment: 'center',verticalAlignment: 'center', });
        sheet.cell(`D${13+index+tableData.timeStat.length}`).value(tableData.motorStat[index] && `${(tableData.motorStat[index]||{}).count}${(tableData.motorStat[index]||{}).unitType || ''}` || '').style({fontSize: 13, fontFamily: '华文行楷',wrapText: true, border: true ,  horizontalAlignment: 'center',verticalAlignment: 'center', });
        sheet.cell(`E${13+index+tableData.timeStat.length}`).value(tableData.motorStat[index] && `${(tableData.motorStat[index]||{}).total}${(tableData.motorStat[index]||{}).unitType || ''}` || '').style({fontSize: 13, fontFamily: '华文行楷',wrapText: true, border: true ,  horizontalAlignment: 'center',verticalAlignment: 'center', });
        sheet.cell(`F${13+index+tableData.timeStat.length}`).value((tableData.bulletStat[index]||{}).type).style({fontSize: 13, fontFamily: '华文行楷',wrapText: true, border: true ,  horizontalAlignment: 'center',verticalAlignment: 'center', });
        sheet.cell(`G${13+index+tableData.timeStat.length}`).value((tableData.bulletStat[index]||{}).trainAverage).style({wrapText: true, border: true ,  horizontalAlignment: 'center',verticalAlignment: 'center', });
        sheet.cell(`H${13+index+tableData.timeStat.length}`).value((tableData.bulletStat[index]||{}).train).style({wrapText: true, border: true ,  horizontalAlignment: 'center',verticalAlignment: 'center', });
        sheet.cell(`I${13+index+tableData.timeStat.length}`).value((tableData.bulletStat[index]||{}).others ).style({wrapText: true, border: true ,  horizontalAlignment: 'center',verticalAlignment: 'center', });
        sheet.cell(`J${13+index+tableData.timeStat.length}`).value((tableData.bulletStat[index]||{}).totalTrainAverage).style({wrapText: true, border: true ,  horizontalAlignment: 'center',verticalAlignment: 'center', });
        sheet.cell(`K${13+index+tableData.timeStat.length}`).value((tableData.bulletStat[index]||{}).totalTrain).style({wrapText: true, border: true ,  horizontalAlignment: 'center',verticalAlignment: 'center', });
        sheet.cell(`L${13+index+tableData.timeStat.length}`).value((tableData.bulletStat[index]||{}).totalOthers).style({wrapText: true, border: true ,  horizontalAlignment: 'center',verticalAlignment: 'center', });
    }
    tableData.timeStat.map((item, index)=>{
        sheet.cell(`A${7+index}`).value(handlerPersonProperty(item.type)).style({wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center'});
        sheet.cell(`B${7+index}`).value(item.hoursInDay).style({wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center'});
        sheet.cell(`C${7+index}`).value(item.hoursAtNight).style({wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center'});
        sheet.cell(`D${7+index}`).value(item.totalHoursInDay).style({wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center'});
        sheet.cell(`E${7+index}`).value(item.totalHoursAtNight).style({wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center'});
    });
    sheet.row(1).height(25);
    sheet.row(2).height(5);
    let columnArr = ['G', 'H', 'J', 'K'];
    let rowHight = 430/(bulletStatLength(tableData) + 13+tableData.timeStat.length);
    tableLetters.map(item=>sheet.column(item).width(columnArr.includes(item) && 6.7 || 13.4));
    for (let i=0; i< (bulletStatLength(tableData) + 13+tableData.timeStat.length); i++){
        if (i>3)sheet.row(i).height(((i === (8+tableData.timeStat.length)) || (i === (12+tableData.timeStat.length))) && 2*rowHight || rowHight);
    }
    sheet.range(`A1:${tableLetters[tableLetters.length-1]}1`).merged(true).value(excelName).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center',});
    rangeArr.map(item=>sheet.range(item.range).merged(true).value(item.value).style({fontSize: item.fontSize || 11, fontFamily: item.fontFamily || '宋体', wrapText: true, bold: item.bold, border: item.border , horizontalAlignment:item.horizontalAlignment ||  'center',verticalAlignment: 'center', verticalText: item.verticalText}));
    cellArr.map(item=>sheet.cell(item.cell).value(item.value).style({fontSize: item.fontSize || 11, fontFamily: item.fontFamily || '宋体',wrapText: true, border: item.border , bold: item.bold, horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
};
