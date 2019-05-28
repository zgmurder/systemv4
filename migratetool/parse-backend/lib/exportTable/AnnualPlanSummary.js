import {ScoreCriteria2,Departments, Letters} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'
const handlerAnnualStages=(AnnualStages,num)=>{
    if(!AnnualStages)return '';
    let str = '';
    AnnualStages.stages.map(item=>{
        if(item.task){
            str += `${CommonAPI.format(item.fromDate.iso ? item.fromDate.iso : item.fromDate, 'MM月DD日')}至${CommonAPI.format(item.toDate.iso ? item.toDate.iso : item.toDate ,'MM月DD日')}安排${item.task}训练；`
        }
    });
    const str2 = AnnualStages.majors.toString();
    if(AnnualStages.name){
        return AnnualStages.name+'：'+str
    }else {
        return `${AnnualStages.orgCategory+str2}：${str}`
    }
};
export const handleExportCallBack=(sheet, excelName, tableData)=> {
    sheet.row(1).height(25);
    let tableLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    let headArr = [
        {text:'参训兵力', value: tableData.personReqs},
        {text:'训练阶段起止时间', value: ''},
        {text: '训练内容', value: tableData.trainContents},
        {text: '重要训练活动', value: tableData.activities},
        {text: '质量指标', value: tableData.scoreReqs},
        {text: '措施与要求', value: tableData.methods}];
    let $length = tableData.annualStages.length > 12 ? tableData.annualStages.length : 12;
    tableLetters.map((item, index)=>{
        sheet.column(item).width(item === 'B' ? 70 : 12.5);
        sheet.cell(`${item}3`).value(headArr[index].text).style({ bold: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center'});
        if (item === 'B') return;
        sheet.range(`${item}4:${item}${$length + 4}`).merged(true).value(headArr[index].value).style({ wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center'})
    });
    sheet.range('A1:F1').merged(true).value(excelName).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center'});
    sheet.row(3).height(20);
    let heightValue = 395/$length;
    for (let i=0;i<=$length;i++){
        sheet.row(i+4).height(heightValue);
        sheet.cell(`B${i+4}`).value(handlerAnnualStages(tableData.annualStages[i] || '')).style({ wrapText: true,border: true, horizontalAlignment: 'center',verticalAlignment: 'center'});
    }

};
