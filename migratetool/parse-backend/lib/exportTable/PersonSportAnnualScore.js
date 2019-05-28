import {Letters, ScoreCriteria} from 'src/lib/Constants'
import CommonAPI from './CommonAPI'

const level2 = [...ScoreCriteria.Level2.optionalScores].reverse();
const level4 = [...ScoreCriteria.Level4.optionalScores].reverse();
const level7 = [...ScoreCriteria.Level7.optionalScores].reverse();
const isCivilServant=(tableData)=>{
    return tableData.isCivilServant
};
const isXinBing=(tableData)=>{
    return tableData.physicalLevel === '新兵'
};
const isSoldier=(tableData)=>{
    return !isCivilServant(tableData) && !isXinBing(tableData)
};
const requiredCourseScores=(tableData)=>{
    return tableData.requiredCourseScores
};
const isOneOrTow=(tableData)=>{
    const found = requiredCourseScores(tableData).find(item=>item.courseName.includes("基础体能组合"));
    return found.courseName.substr(found.courseName.length-1,1)
};
const optionalCourseScores=(tableData)=>{
    return tableData.optionalCourseScores
};
const getCourseScore=(courseName,tableData)=>{
    return requiredCourseScores(tableData).find(courseObj=> {
        const name = (courseObj.courseName||'').replace(/[ ]/g, "").trim();
        return name.startsWith(courseName.slice(0,3));
    }) || {}
};
const handleCourseCount=(course)=>{
    if(!course || !course.courseName)return '';
    if(course.countType === '')return level4[level4.length-course.count];
    else if(course.countType === '时间'){
        const integer = parseInt(+course.count);
        const float = +(course.count - integer).toFixed(1)*10;
        const minute = Math.floor(integer / 60) ? Math.floor(integer / 60)+ "' " : '';
        return minute + integer % 60 + '" '+ (float > 0 ? float : '');
    }else if(course.courseName.includes('马')){
        return level4[level4.length-found[name]];
    }else {
        return course.count
    }
};
export const handleExportCallBack=(sheet, excelName, tableData)=> {
    const tableLetters = Letters.slice(0, 16);
    let physicalLevel = ['一类人员','二类人员','三类人员'];
    let physicalLevelValue = [];
    let basicPhysicalValue = `基础体能组合1${(isXinBing(tableData) && isOneOrTow(tableData) === '1') && '☑' || '☐'}/2${(isXinBing(tableData) && isOneOrTow(tableData) === '1') && '☑' || '☐'}`;
    let civilServantArr = ['单杠1练习（引体向上）','俯卧撑（40岁以上）','仰卧起坐','3000米跑'];
    let newSoldierArr = ['单杠引体向上/屈臂悬垂','双杠臂屈伸/支撑前移','仰卧起坐','3000米跑','基础体能组合'];
    let soldierArr = [['单杠引体向上/屈臂悬垂', '单杠'],['俯卧撑（40岁以上）', '俯卧'],['仰卧起坐', '仰卧起坐'],['30米x2蛇形跑', '30米x2蛇形跑'],['3000米跑','3000米跑']];
    let groupIdValue = [];
    let level4SoldierValue = ['', '', '', '',];
    let level2Value = [[], [], [],];
    let scoreValue = [[], [], [], []];
    let scoreNewSoldierValue = [[], [], [], [], []];
    let scoreCivilServantValue = [[], [], []];
    level2.map((item,index)=>{
        let value1 = isXinBing(tableData) && tableData.shape.score === level2.length - index;
        let value2 = isSoldier(tableData) && tableData.shape.score === level2.length - index;
        let value3 = isCivilServant(tableData) && tableData.shape.score === level2.length - index;
        level2Value[0].push(`${item}${value1 && '☑' || '☐'}`);
        level2Value[1].push(`${item}${value2 && '☑' || '☐'}`);
        level2Value[2].push(`${item}${value3 && '☑' || '☐'}`);
    });
    level4.map((item,index)=>{
        for (let i = 0; i < 5; i++){
            if (i < 4){
                level4SoldierValue[i] += `${index ===1 && '良  好' || item}${(isSoldier(tableData) && (optionalCourseScores(tableData)[i]||{}).score === level4.length - index) && '☑' || '☐'} `;
                if (index === 1)level4SoldierValue[i] += '\n';
                let value = undefined;
                if (i===0){
                    value = (isXinBing(tableData) && tableData.evaluatedScore === level4.length - index);
                } else if (i===1){
                    value = (isSoldier(tableData) && tableData.optionalScore === level4.length - index);
                } else {
                    value = (isCivilServant(tableData) && tableData.evaluatedScore === level4.length - index);
                }
                if(i <3){
                    scoreValue[i].push(`${item}${(value) && '☑' || '☐'}`);
                    scoreCivilServantValue[i].push(`${item}${(isCivilServant(tableData) && getCourseScore(civilServantArr[i>0 && i + 1 || i], tableData).score === level4.length - index) && '☑' || '☐'}`)
                }
            }
            scoreNewSoldierValue[i].push(`${item}${(isXinBing(tableData) && getCourseScore(newSoldierArr[i], tableData).score === level4.length - index) && '☑' || '☐'}`);
        }
    });
    level7.map((item,index)=>scoreValue[3].push(`${item}${(isSoldier(tableData) && tableData.evaluatedScore === level7.length - index) && '☑' || '☐'}`));
    sheet.range(`A1:${tableLetters[tableLetters.length-1]}1`).value(excelName).merged(true).style({fontSize: 18, fontFamily: 'FZXBSJW', horizontalAlignment: 'center',verticalAlignment: 'center',});
    physicalLevel.map(item=>{
        if (!isCivilServant(tableData) && !isXinBing(tableData) && tableData.physicalLevel === item) return physicalLevelValue.push(`${item.substring(0,2)}☑`);
        physicalLevelValue.push(`${item.substring(0,2)}☐`);
    });
    for(let i=0; i < 5; i++){
        if (i<4){
            groupIdValue.push(`${i+1}${(isSoldier(tableData) && tableData.groupId === (i+1)) && '☑' || '☐'}`);
            sheet.range(`E${21+i}:H${21+i}`).merged(true).value(`课目${i+1}：${isSoldier(tableData) && (optionalCourseScores(tableData)[i]||{}).courseName||'　'}`).style({fontSize: 9,wrapText: true,border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`I${21+i}`).value(`${handleCourseCount(isSoldier(tableData) && optionalCourseScores(tableData)[i]||'')}`).style({fontSize: 9,wrapText: true,border: true, horizontalAlignment: 'center',verticalAlignment: 'center',});
            sheet.cell(`I${i+27}`).value(handleCourseCount(isCivilServant(tableData) && getCourseScore(civilServantArr[i], tableData))).style({fontSize: 9,wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center',})
            sheet.range(`C${i+27}:H${i+27}`).merged(true).value(civilServantArr[i]).style({fontSize: 9,wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center',})
        }
        sheet.cell(`I${i+9}`).value((handleCourseCount(isXinBing(tableData) && getCourseScore(newSoldierArr[i], tableData)||''))).style({fontSize: 9,wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center',})
        sheet.range(`C${i+9}:H${i+9}`).merged(true).value(i === 4 && basicPhysicalValue ||newSoldierArr[i]).style({fontSize: 9,wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center',});
        sheet.cell(`I${i+16}`).value((handleCourseCount(isSoldier(tableData) && getCourseScore(soldierArr[i][1], tableData)||''))).style({fontSize: 9,wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center',})
        sheet.range(`D${i+16}:H${i+16}`).merged(true).value(soldierArr[i][0]).style({fontSize: 9,wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center',})
        sheet.range(`J${i+9}:O${i+9}`).merged(true).value(scoreNewSoldierValue[i].join(' ')).style({fontSize: 9,wrapText: true, border: true , horizontalAlignment: 'center',verticalAlignment: 'center',})
    }
    let rangeArr = [
        {range: 'A3:B5', value: '基本\n信息', border: true},
        {range: 'C3:E3', value: '姓名', border: true},
        {range: 'F3:H3', value: tableData.name, border: true},
        {range: 'J3:L3', value: tableData.gender, border: true},
        {range: 'M3:O3', value: '年龄', border: true},
        {range: 'C4:H4', value: '部职别', border: true},
        {range: `I4:${tableLetters[tableLetters.length-1]}4`, value: tableData.departmentPosition, border: true},
        {range: 'C5:H5', value: '军人保障卡号\n（新兵、文职人员身份证号）', border: true},
        {range: `I5:${tableLetters[tableLetters.length-1]}5`, value: tableData.cardId, border: true},
        {range: 'A6:A30', value: '考核\n成绩', border: true},
        {range: 'B6:B13', value: '新兵', border: true},
        {range: 'B14:B24', value: physicalLevelValue.join('\n'), border: true},
        {range: 'B25:B30', value: '文职\n人员', border: true},
        {range: 'C6:H6', value: '课目名称', border: true, bold: true},
        {range: 'J6:O6', value: '单课目成绩评定', border: true, bold: true},
        {range: 'C31:P31', value: '', border: true},
        {range: 'A32:B32', value: '审核人：'},
        {range: 'C32:I32', value: '填写人：',horizontalAlignment: 'right'},
        {range: 'C7:H8', value: '体型', border: true},
        {range: 'C14:C20', value: '通用\n训练\n课目', border: true},
        {range: 'C21:C24', value: '专项\n训练\n课目\n组', border: true},
        {range: 'D14:H15', value: '体型', border: true},
        {range: 'D21:D24', value: groupIdValue.join('\n'), border: true},
        {range: 'C25:H26', value: '体型', border: true, },
        {range: 'J21:M21', value: level4SoldierValue[0], border: true, },
        {range: 'J22:M22', value: level4SoldierValue[1], border: true, },
        {range: 'J23:M23', value: level4SoldierValue[2], border: true, },
        {range: 'J24:M24', value: level4SoldierValue[3], border: true, },
        {range: 'P7:P13', value: scoreValue[0].join('\n'), border: true, },
        {range: 'P14:P24', value: scoreValue[3].join('\n'), border: true, },
        {range: 'N21:O24', value: scoreValue[1].join('\n'), border: true, },
        {range: 'P25:P30', value: scoreValue[2].join('\n'), border: true, },
        {range: 'J7:O8', value: level2Value[0].join('  '), border: true, },
        {range: 'J14:O15', value: level2Value[1].join('  '), border: true, },
        {range: 'J25:O26', value: level2Value[2].join('  '), border: true, },
        {range: 'J16:M17', value: `分数：${isSoldier(tableData) && (getCourseScore('单杠', tableData).score?getCourseScore('单杠',tableData).score: getCourseScore('俯卧', tableData).score)||''}`, border: true, },
        {range: 'J18:M18', value: `分数：${isSoldier(tableData) && getCourseScore(soldierArr[2][0], tableData).score||''}`, border: true, },
        {range: 'J19:M19', value: `分数：${isSoldier(tableData) && getCourseScore(soldierArr[3][0], tableData).score||''}`, border: true, },
        {range: 'J20:M20', value: `分数：${isSoldier(tableData) && getCourseScore(soldierArr[4][0], tableData).score||''}`, border: true, },
        {range: 'N16:O20', value: `总分：${isSoldier(tableData) && tableData.totalScore||''}`, border: true, },
        {range: 'N16:O20', value: `总分：${isSoldier(tableData) && tableData.totalScore||''}`, border: true, },
        {range: 'J27:O28', value: scoreCivilServantValue[0].join(' '), border: true, },
        {range: 'J29:O29', value: scoreCivilServantValue[1].join(' '), border: true, },
        {range: 'J30:O30', value: scoreCivilServantValue[2].join(' '), border: true, },
        {range: 'A31:B31', value: '备注', border: true},
        {range: 'N32:P32', value: CommonAPI.format(tableData.date), horizontalAlignment: 'right'},
    ];
    let cellArr = [
        { cell: 'I3', value: '性别', border: true},
        { cell: 'P3', value: tableData.age, border: true},
        { cell: 'I6', value: '课目成绩', border: true, bold: true},
        { cell: 'P6', value: '总评', border: true, bold: true},
        { cell: 'I7', value: `身高：${isXinBing(tableData) && tableData.shape.height+'cm' || ''}`, border: true, textAlign: 'left'},
        { cell: 'I8', value: `体重：${isXinBing(tableData) && tableData.shape.weight+'kg' || ''}`, border: true, textAlign: 'left'},
        { cell: 'I14', value: `身高：${isSoldier(tableData) && tableData.shape.height+'cm' || ''}`, border: true, textAlign: 'left'},
        { cell: 'I15', value: `体重：${isSoldier(tableData) && tableData.shape.weight+'kg' || ''}`, border: true, textAlign: 'left'},
        { cell: 'I25', value: `身高：${isCivilServant(tableData) && tableData.shape.height+'cm' || ''}`, border: true, textAlign: 'left'},
        { cell: 'I26', value: `体重：${isCivilServant(tableData) && tableData.shape.weight+'kg' || ''}`, border: true, textAlign: 'left'},
    ];
    for(let i = 1; i< 32; i++){
        let height = 20;
        if (i ===1) height = 25;
        if (i ===2) height = 5;
        if (i ===5) height = 30;
        if (i >20 && i < 25) height = 35;
        if (i === 31) height = 50;
        sheet.row(i).height(height);
    }
    tableLetters.map(item=>{
        let width = 4.5;
        if (item === 'B') width = 6.6;
        if (item === 'I') width = 12;
        if (item === 'L' ||item === 'M') width = 6;
        if (item === 'P') width = 8.5;
        sheet.column(item).width(width);
    });
    rangeArr.map(item=>sheet.range(item.range).merged(true).value(item.value).style({fontSize: 9,wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
    cellArr.map(item=>sheet.cell(item.cell).value(item.value).style({fontSize: 9,wrapText: true, bold: item.bold, border: item.border , horizontalAlignment: item.horizontalAlignment || 'center',verticalAlignment: 'center', verticalText: item.verticalText}));
};
