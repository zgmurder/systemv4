import {Letters} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'
import courseUtils from 'src/lib/utils/courseUtils'

const renderCourseName=(courseItem)=> {
    let courseName = courseUtils.makeupCourseName(courseItem);
    return courseName;
};

export const handleExportCallBack=(sheet, excelName, tableData)=>{
    const tableWidth = tableData.planItems.length + 7;
    const tableLetterWidth = Letters.slice(0, tableWidth);
    const tableContentWidth = Letters.slice(2, tableData.planItems.length+2);
    const rangeValue = [
        {range: 'A3:B4', value: '区分', bold: true,border: true,},
        {range: `C3:${tableLetterWidth[tableLetterWidth.length-6]}3`, value: '内容与时间分配', bold: true,border: true,},
        {range: `${tableLetterWidth[tableLetterWidth.length-5]}3:${tableLetterWidth[tableLetterWidth.length-5]}4`, value: '训练\n时间', bold: true,border: true,},
        {range: `${tableLetterWidth[tableLetterWidth.length-4]}3:${tableLetterWidth[tableLetterWidth.length-4]}4`, value: '重要\n训练\n活动', bold: true,border: true,},
        {range: `${tableLetterWidth[tableLetterWidth.length-3]}3:${tableLetterWidth[tableLetterWidth.length-3]}4`, value: '质量\n指标', bold: true,border: true,},
        {range: `${tableLetterWidth[tableLetterWidth.length-2]}3:${tableLetterWidth[tableLetterWidth.length-2]}4`, value: '基本\n要求', bold: true,border: true,},
        {range: `${tableLetterWidth[tableLetterWidth.length-1]}3:${tableLetterWidth[tableLetterWidth.length-1]}4`, value: '保障\n措施', bold: true,border: true,},
        {range: 'A5:A6', value: tableData.orgCategory, bold: false, verticalText: true,border: true,},
        {range: `${tableLetterWidth[tableLetterWidth.length-4]}5:${tableLetterWidth[tableLetterWidth.length-4]}6`, value: tableData.activities, border: true,},
        {range: `${tableLetterWidth[tableLetterWidth.length-3]}5:${tableLetterWidth[tableLetterWidth.length-3]}6`, value: tableData.scoreReqs, border: true,},
        {range: `${tableLetterWidth[tableLetterWidth.length-2]}5:${tableLetterWidth[tableLetterWidth.length-2]}6`, value: tableData.basicReqs, border: true,},
        {range: `${tableLetterWidth[tableLetterWidth.length-1]}5:${tableLetterWidth[tableLetterWidth.length-1]}6`, value: tableData.methods, border: true,},
        {range: 'A7:B7', value: '备注',border: true,},
        {range: `C7:${tableLetterWidth[tableLetterWidth.length-1]}7`, value: tableData.notes, border: true},
        {range: 'A8:C8', value: '审核人：', border: false, horizontalAlignment: 'left'},
        {range: `D8:${tableLetterWidth[tableLetterWidth.length-3]}8`, value: '填写人：'},
        {range: `${tableLetterWidth[tableLetterWidth.length-2]}8:${tableLetterWidth[tableLetterWidth.length-1]}8`, value: CommonAPI.format(tableData && tableData.date, 'MM月DD日'), border: false},
    ];
    let cellArr = [
        {cell: 'B5', value: '警官', verticalText: true,  border: true},
        {cell: 'B6', value: '分队', verticalText: true,  border: true},
        {cell: `${tableLetterWidth[tableLetterWidth.length-5]}5`, value: `${tableData.officerHours}小时`,  border: true},
        {cell: `${tableLetterWidth[tableLetterWidth.length-5]}6`, value: `${tableData.soldierHours}小时`,  border: true},
    ];
    const rowHeight = [
        {row:1, height: 25},
        {row:2, height: 5},
        {row:3, height: 20},
        {row:4, height: 70},
        {row:5, height: 155},
        {row:6, height: 155},
        {row:7, height: 40},
    ];
    let columnWidth = 86/tableData.planItems.length;
    rowHeight.map(item=>sheet.row(item.row).height(item.height));
    tableLetterWidth.map(item=>{
        let width = 8;
        if ((item === 'A' || item === 'B')) width = 3;
        if (tableContentWidth.includes(item)) width = columnWidth;
        sheet.column(item).width(width);
    });
    tableData.planItems.map((item, index)=>{
        sheet
            .cell(`${tableContentWidth[index]}4`)
            .value(`${CommonAPI.format(item.fromDate, 'MM月DD日')}至${CommonAPI.format(item.toDate, 'MM月DD日')}\n（${item.days}天，${item.hours}小时）`)
            .style({wrapText: true, bold: true,border: true,  horizontalAlignment: 'center',verticalAlignment: 'center'});
        let officerCourses = [];
        let orgCourses = [];
        item.officerCourses.length && item.officerCourses.map(item=>officerCourses.push(renderCourseName(item)));
        item.orgCourses.length && item.orgCourses.map(item=>orgCourses.push(renderCourseName(item)));
        sheet
            .cell(`${tableContentWidth[index]}5`)
            .value(officerCourses.join('\n'))
            .style({wrapText: true, border: true,  horizontalAlignment: 'center',verticalAlignment: 'center'});
        sheet
            .cell(`${tableContentWidth[index]}6`)
            .value(orgCourses.join('\n'))
            .style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center'});
    });
    sheet.range(`A1:${tableLetterWidth[tableLetterWidth.length-1]}1`).merged(true).value(excelName).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center',});
    rangeValue.map(item=>{
        sheet.range(item.range).merged(true).value(item.value).style({wrapText: true, bold: item.bold, border: item.border , horizontalAlignment:item.horizontalAlignment||'center',verticalAlignment: 'center', verticalText: item.verticalText});
    });
    cellArr.map(item=>{
        sheet.cell(item.cell).value(item.value).style({wrapText: true, border: item.border , horizontalAlignment: item.horizontalAlignment||'center',verticalAlignment: 'center', verticalText: item.verticalText});
    });
};
