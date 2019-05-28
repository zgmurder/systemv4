import {Letters, DailySection,OrgSequence} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'

export const handleExportCallBack=(sheet, excelName, tableData)=>{
    let tableLetters = Letters.slice(0,20);
    sheet.row(1).height(25);
    sheet.range("A1:T1").merged(true).value(excelName).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center',});
    sheet.cell("A2").value(`单位：${tableData.targetOrg.displayName}`).style({"underline": true, fontSize: 12, fontFamily: '华文行楷'});
    sheet.range("Q2:T2").merged(true).value(`日期：${CommonAPI.format(tableData.date)}`).style({"underline": true,horizontalAlignment: 'right'});
    sheet.range("A4:J4").merged(true).value('训练人员').style({ bold: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center'});
    sheet.range("K4:T4").merged(true).value('训练时间').style({ bold: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center'});
    sheet.range("A10:J10").merged(true).value('训练内容').style({ bold: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center'});
    sheet.range("K10:T10").merged(true).value('训练弹药').style({ bold: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center'});
    sheet.range("A17:J17").merged(true).value('摩托(飞行)小时').style({ bold: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center'});
    let str = `本级训练\n(人均/总数）`;
    let rangeArr = [
        {range: "A5:B6", value: '实力数'},{range: "C5:D6", value: '参训人数'},{range: "E5:F6", value: '参训率'},{range: "G5:J6", value: '未参加人员及原因'},
        {range: "K5:L6", value: '区分'},{range: "M5:P5", value: '当日训练时间'},{range: "Q5:T5", value: '累积训练时间'},{range: "M6:N6", value: '昼'},
        {range: "O6:P6", value: '夜'},{range: "Q6:R6", value: '昼'},{range: "S6:T6", value: '夜'},{range: "A7:B9", value: tableData.personStat.total||0},
        {range: "C7:D9", value: tableData.personStat.present||0},{range: "E7:F9", value: `${tableData.personStat.presentRate||0}%`},{range: "G7:J9", value: tableData.personStat.notes,fontFamily: '华文行楷', fontSize: 12},
        {range: "A11:B11", value: DailySection.EarlyMoring},{range: "A12:B13", value: DailySection.Morning},{range: "A14:B14", value: DailySection.Afternoon},{range: "A15:B15", value: DailySection.Sport},
        {range: "A16:B16", value: DailySection.Night},{range: "C11:J11", value: (tableData.contentStat.earlyMoring || []).join('、'),fontFamily: '华文行楷', fontSize: 12},{range: "C12:J13", value: (tableData.contentStat.morning || []).join('、'),fontFamily: '华文行楷', fontSize: 12},
        {range: "C14:J14", value: (tableData.contentStat.afternoon || []).join('、'),fontFamily: '华文行楷', fontSize: 12}, {range: "C15:J15", value: (tableData.contentStat.sport || []).join('、'),fontFamily: '华文行楷', fontSize: 12}, {range: "C16:J16", value: (tableData.contentStat.night || []).join('、'),fontFamily: '华文行楷', fontSize: 12},
        {range: "K11:L13", value: '弹药类型'},{range: "M11:P11", value: '当日消耗量'},{range: "Q11:T11", value: '累计消耗量'},{range: "M12:N13", value: str},
        {range: "O12:P13", value: '其他'},{range: "Q12:R13", value: str},{range: "S12:T13", value: '其他'},{range: "A18:F18", value: '区分'},{range: "A18:F18", value: '区分'},
        {range: "G18:H18", value: '当日完成量'},{range: "I18:J18", value: '累计完成量'},
    ];
    let timeStatArr = [];
    tableData.timeStat.map((item, index)=>{
        if (tableData.timeStat.length<2) {
            timeStatArr = [{range: "K7:L9", value: (tableData.timeStat[0]||{}).type},{range: "M7:N9", value: (tableData.timeStat[0]||{}).hoursInDay},{range: "O7:P9", value: (tableData.timeStat[0]||{}).hoursAtNight},
                {range: "Q7:R9", value: (tableData.timeStat[0]||{}).totalHoursInDay},{range: "S7:T9", value: (tableData.timeStat[0]||{}).totalHoursAtNight}]
        }else {
            timeStatArr.push({range: `K${index+7}:L${index+7}`, value: (tableData.timeStat[index]||{}).type});
            timeStatArr.push({range: `M${index+7}:N${index+7}`, value: (tableData.timeStat[index]||{}).hoursInDay});
            timeStatArr.push({range: `O${index+7}:P${index+7}`, value: (tableData.timeStat[index]||{}).hoursAtNight});
            timeStatArr.push({range: `Q${index+7}:R${index+7}`, value: (tableData.timeStat[index]||{}).totalHoursInDay});
            timeStatArr.push({range: `S${index+7}:T${index+7}`, value: (tableData.timeStat[index]||{}).totalHoursAtNight});
        }
    });
    let $length =  tableData.motorStat.length>8 ? tableData.motorStat.length : 8;
    for (var i=0;i<($length +5);i++){
        timeStatArr.push({range: `K${i+14}:L${i+14}`, value: (tableData.bulletStat[i]||{}).type,fontFamily: '华文行楷', fontSize: 12});
        timeStatArr.push({range: `O${i+14}:P${i+14}`, value: (tableData.bulletStat[i]||{}).others});
        timeStatArr.push({range: `S${i+14}:T${i+14}`, value: (tableData.bulletStat[i]||{}).totalOthers});
        sheet.cell(`M${i+14}`).value((tableData.bulletStat[i]||{}).trainAverage).style({ border: true, horizontalAlignment: 'center',verticalAlignment: 'center'});
        sheet.cell(`N${i+14}`).value((tableData.bulletStat[i]||{}).train).style({ border: true, horizontalAlignment: 'center',verticalAlignment: 'center'});
        sheet.cell(`Q${i+14}`).value((tableData.bulletStat[i]||{}).totalTrainAverage).style({ border: true, horizontalAlignment: 'center',verticalAlignment: 'center'});
        sheet.cell(`R${i+14}`).value((tableData.bulletStat[i]||{}).totalTrain).style({ border: true, horizontalAlignment: 'center',verticalAlignment: 'center'});
        if (i+19< $length+19) {
            timeStatArr.push({range: `A${i+19}:F${i+19}`, value: (tableData.motorStat[i]||{}).type, fontFamily: '华文行楷', fontSize: 12});
            timeStatArr.push({range: `G${i+19}:H${i+19}`, value: !tableData.motorStat[i] ? "" : `${(tableData.motorStat[i]||{}).count}${(tableData.motorStat[i]||{}).unitType}`,fontFamily: '华文行楷', fontSize: 12});
            timeStatArr.push({range: `I${i+19}:J${i+19}`, value: !tableData.motorStat[i] ? "" : `${(tableData.motorStat[i]||{}).total}${(tableData.motorStat[i]||{}).unitType}`,fontFamily: '华文行楷', fontSize: 12});
        }
    }
    let allRangeArr = rangeArr.concat(timeStatArr);
    allRangeArr.map((item, index)=>{
        if (index < $length+15)sheet.row(index+4).height(18);
        sheet.range(item.range).merged(true).value(item.value).style({ border: true, fontFamily: item.fontFamily || '宋体', fontSize: item.fontSize || 11,horizontalAlignment: 'center',verticalAlignment: 'center', wrapText: true});
    });
    tableLetters.map(item=>sheet.column(item).width((item === 'A' || item === 'K') && 7.2 ||6.6));
    sheet.cell(`A${$length+19}`).value('填写人：');
    let $isCompany = tableData.organization && (tableData.organization.orgSequence === OrgSequence.Company);
    sheet.range(`R${$length+19}:T${$length+19}`).merged(true).value($isCompany && '中队主官：' || '主官：').style({horizontalAlignment: 'right'});
};
