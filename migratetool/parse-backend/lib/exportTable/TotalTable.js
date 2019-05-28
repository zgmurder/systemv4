import {Letters, ScoreCriteria2} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'

const personScoreRanks=(tableData)=>{
    return tableData.personScoreRanks
};
const orgScoreRanks=(tableData)=>{
    return tableData.orgScoreRanks
};
const courseScores=(tableData)=> {
    return personScoreRanks(tableData).reduce((prev, curr) => {
        curr.courseScores.forEach(course => {
            const found = prev.find(item => item.courseId === course.courseId);
            !found && prev.push(course)
        });
        return prev
    }, []);
};
const timeToString=(value,countType)=> {
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
const combineRow=(index,row)=>{
    if(!row[index])return 1;
    const orgName = row[index].organization.name;
    const calculate = (orgName,index,num = 1)=>{
        const is = row[index+1] && row[index+1].organization.name === orgName;
        return is ? calculate(orgName,index+1,num+1) : num;
    };
    return calculate(orgName,index)
};
const showRow=(index,row)=>{
    if(!row[index])return true;
    const personArr = [row[index],row[index-1]];
    const orgArr = personArr.map(item=>item && item.organization.objectId);
    return orgArr[0] !== orgArr[1]
};
const handleOrgRank=(objectId, tableData)=>{
    return orgScoreRanks(tableData).find(item=>item.organization.objectId === objectId).rank
};
const scoreOptions=(scoreCriteria)=>{
    const found = Object.values(ScoreCriteria2).find(item=>item.name === scoreCriteria);
    return found.optionalScores || {}
};
const handleCourseScores=(courseScoresVal,index, tableData)=>{
    const course = courseScores(tableData)[Math.floor((index-1)/3)];
    const found = courseScoresVal.find(item=>item.courseId === course.courseId);
    if(!found)return '　';
    let {count,score,rank} = found;
    count = timeToString(found.count,found.countType);
    score = scoreOptions(found.scoreCriteria)[score]||score;
    return index%3===1?score:(index%3===2?count:rank);
};
export const handleExportCallBack=(sheet, excelName, tableData)=> {
    let tableLetters = Letters.slice(0,7+3*courseScores(tableData).length);
    let tableCourseLetters = Letters.slice(4, 4+3*courseScores(tableData).length);
    let rangeArr = [
        { range: 'A3:A4', value: '#', border: true},
        { range: 'B3:B4', value: '单位', border: true},
        { range: 'C3:C4', value: '姓名', border: true},
        { range: 'D3:D4', value: '职位', border: true},
        { range: `${tableLetters[tableLetters.length-3]}3:${tableLetters[tableLetters.length-3]}4`, value: '总分', border: true},
        { range: `${tableLetters[tableLetters.length-2]}3:${tableLetters[tableLetters.length-2]}4`, value: '个人排名', border: true},
        { range: `${tableLetters[tableLetters.length-1]}3:${tableLetters[tableLetters.length-1]}4`, value: '单位排名', border: true},
    ];
    courseScores(tableData).length && courseScores(tableData).map((item, index)=>{
        sheet.range(`${tableCourseLetters[index*3]}3:${tableCourseLetters[index*3+2]}3`).merged(true).value(item.courseName).style({wrapText: true, border: true, horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center'});
        sheet.cell(`${tableCourseLetters[index*3]}4`).value('成绩').style({wrapText: true, border: true, horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center'});
        sheet.cell(`${tableCourseLetters[index*3 + 1]}4`).value('得分').style({wrapText: true, border: true, horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center'});
        sheet.cell(`${tableCourseLetters[index*3 + 2]}4`).value('排名').style({wrapText: true, border: true, horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center'});
    });

    let [tableOrgArr, tableOrgValueArr, tableRowHeight, tableColumnWidth] = [[], [], 450/(2+2*personScoreRanks(tableData).length), 138/(tableLetters.length)];
    personScoreRanks(tableData).length && personScoreRanks(tableData).map((item, index)=>{
        sheet.cell(`A${index+5}`).value(index).style({wrapText: true, border: true, horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center'});
        sheet.cell(`C${index+5}`).value(item.name || (item.soldier && item.soldier.name)).style({wrapText: true, border: true, horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center'});
        sheet.cell(`D${index+5}`).value(item.position).style({wrapText: true, border: true, horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center'});
        sheet.cell(`${tableLetters[tableLetters.length-3]}${index+5}`).value(item.totalScore).style({wrapText: true, border: true, horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center'});
        sheet.cell(`${tableLetters[tableLetters.length-2]}${index+5}`).value(item.rank).style({wrapText: true, border: true, horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center'});
        courseScores(tableData).length && courseScores(tableData).map((subItem, subIndex)=>{
            sheet.cell(`${tableCourseLetters[subIndex*3]}${index+5}`).value(handleCourseScores(item.courseScores,subIndex*3+1, tableData)).style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center'});
            sheet.cell(`${tableCourseLetters[subIndex*3 + 1]}${index+5}`).value(handleCourseScores(item.courseScores,subIndex*3+2, tableData)).style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center'});
            sheet.cell(`${tableCourseLetters[subIndex*3 + 2]}${index+5}`).value(handleCourseScores(item.courseScores,subIndex*3+3, tableData)).style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center'});
        });
        if (showRow(index,personScoreRanks(tableData)))tableOrgArr.push({length: combineRow(index,personScoreRanks(tableData)), org:personScoreRanks(tableData)[index] && personScoreRanks(tableData)[index].organization.name || '　', orgRank: handleOrgRank(item.organization.objectId, tableData)});
        sheet.row(index+5).height(2*tableRowHeight);
    });
    tableOrgValueArr = tableOrgArr.reduce((prev, cur, index)=>{
        prev.push([0 + (index && prev[index-1][1]), cur.length + (index && prev[index-1][1]), cur]);
        return prev;
    }, []);

    tableOrgValueArr.length && tableOrgValueArr.map(item=>{
        if (item[2].length === 1){
            sheet.cell(`A${item[0]+5}`).value(item[2].org).style({wrapText: true, border: true, horizontalAlignment:'center',verticalAlignment: 'center'});
            sheet.cell(`${tableLetters[tableLetters.length-1]}${item[0]+5}`).value(item[2].orgRank).style({wrapText: true, border: true, horizontalAlignment: 'center',verticalAlignment: 'center'});
        } else {
            sheet.range(`B${item[0]+5}:B${item[1]+4}`).merged(true).value(item[2].org).style({wrapText: true, border: true, horizontalAlignment:'center',verticalAlignment: 'center'});
            sheet.range(`${tableLetters[tableLetters.length-1]}${item[0]+5}:${tableLetters[tableLetters.length-1]}${item[1]+4}`).merged(true).value(item[2].orgRank).style({wrapText: true, border: true, horizontalAlignment:'center',verticalAlignment: 'center'});
        }
    });
    sheet.row(1).height(25);
    sheet.row(2).height(10);
    sheet.row(3).height(tableRowHeight);
    sheet.row(4).height(tableRowHeight);
    sheet.range(`A1:${tableLetters[tableLetters.length-1]}1`).merged(true).value(excelName).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center',});
    tableLetters.map(item=>sheet.column(item).width(item === 'A' && 4 ||tableColumnWidth));
    rangeArr.map(item=>sheet.range(item.range).merged(true).value(item.value).style({wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
};
