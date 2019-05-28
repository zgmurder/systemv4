import _ from 'lodash';
import { PersonProperty, SoldierCategory, SpecialForce, MapRankToLevel1 } from "../Constants";

export default {
    // 兼容V4.0以前的版本
    formatOrganization: function (obj) {
        if (!_.isEmpty(obj.orgMajor) && _.isEmpty(obj.orgMajors)) {
            obj.orgMajors = [obj.orgMajor];
        }

        if (_.isEmpty(obj.orgMajor) && !_.isEmpty(obj.orgMajors)) {
            obj.orgMajor = obj.orgMajors[0];
        }

        return obj;
    },

    formatSoldier: function (soldier) {
        if (_.isEmpty(soldier)) return soldier;

        if (!_.isEmpty(soldier.soldierCategory)) {
            // 根据V4.0版本中的soldierCategory字段设置V3.0版本中的personProperty字段
            switch (soldier.soldierCategory) {
                case SoldierCategory.Officer: {
                    soldier.personProperty = PersonProperty.Officer;
                    break;
                }
                case SoldierCategory.TechOfficer: {
                    soldier.personProperty = PersonProperty.TechOfficer;
                    break;
                }
                default: {
                    const rankL1 = MapRankToLevel1(soldier.rank);
                    if (rankL1 === '军官') soldier.personProperty = PersonProperty.Officer;
                    else soldier.personProperty = PersonProperty.Soldier;
                }
            }

            soldier.isCivilServant = false;
            if (soldier.soldierCategory === SoldierCategory.CivilServant) soldier.isCivilServant = true;
            else if (soldier.isSupporter) soldier.personProperty = PersonProperty.Supporter;

            if (soldier.specialForce === SpecialForce.ReserveMember) soldier.personProperty = PersonProperty.ReserveMember;

            if (soldier.organization && (soldier.organization.orgCategory||'').endsWith('新兵分队')) {
                soldier.personProperty = PersonProperty.Recruit;
                if (soldier.soldierCategory === SoldierCategory.Officer) soldier.personProperty = PersonProperty.RecruitOfficer;
            }
        } else if (!_.isEmpty(soldier.personProperty)) {
            // 根据V3.0版本中的personProperty字段设置V4.0版本中的soldierCategory字段
            soldier.isSupporter = false;
            switch (soldier.personProperty) {
                case PersonProperty.Officer: {
                    soldier.soldierCategory = SoldierCategory.Officer;
                    break;
                }
                case PersonProperty.TechOfficer: {
                    soldier.soldierCategory = SoldierCategory.TechOfficer;
                    break;
                }
                default: {
                    const rankL1 = MapRankToLevel1(soldier.rank);
                    if (rankL1 === '士官') soldier.soldierCategory = SoldierCategory.Sergeant;
                    else if (rankL1 === '义务兵') soldier.soldierCategory = SoldierCategory.Soldier;
                    else soldier.soldierCategory = SoldierCategory.Officer;

                    if (soldier.personProperty === PersonProperty.Supporter) soldier.isSupporter = true;
                    if (soldier.personProperty === PersonProperty.ReserveMember) {
                        soldier.isSpecialForce = true;
                        soldier.specialForce = SpecialForce.ReserveMember;
                    }
                }
            }

            if (soldier.isCivilServant) {
                soldier.soldierCategory = SoldierCategory.CivilServant;
            }
        }


        return soldier;
    }
}
