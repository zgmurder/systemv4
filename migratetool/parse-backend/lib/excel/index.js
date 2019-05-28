import {export_json_to_excel} from '../excel/vendor/Export2Excel'
import XlsxPopulate from 'xlsx-populate';
export const exportExcel = (excelData, tHeader, filterVal, excelName)=>{
    const data = excelData.map(v => filterVal.map(j => v[j]));
    export_json_to_excel(tHeader, data, excelName);
};

export const handleExport = (excelName, callBack, tableData)=>{
    XlsxPopulate.fromBlankAsync()
        .then(workbook => {
            let sheet = workbook.sheet("Sheet1");
            callBack(sheet,excelName, tableData);
            workbook.outputAsync().then(function(blob) {
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    // If IE, you must uses a different method.
                    window.navigator.msSaveOrOpenBlob(blob, `${excelName}.xlsx`);
                } else {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    document.body.appendChild(a);
                    a.href = url;
                    a.download = `${excelName}.xlsx`;
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                }
            });

        });
};

