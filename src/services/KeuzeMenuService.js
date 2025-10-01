import { databaseService } from './DatabaseService';
import { DatabasePaths } from '../config/FirebaseConfig';

class KeuzeMenuService {
    constructor() {
        this.keuzeMenusPath = DatabasePaths.menu.keuzeMenus;
    }

    /**
     * 获取所有选择菜单
     */
    async getAllKeuzeMenus() {
        try {
            const data = await databaseService.read(this.keuzeMenusPath);
            return data || {};
        } catch (error) {
            console.error('Error fetching keuzeMenus:', error);
            throw error;
        }
    }

    /**
     * 根据ID数组获取特定的选择菜单
     */
    async getKeuzeMenusByIds(keuzeMenuIds) {
        if (!keuzeMenuIds || keuzeMenuIds.length === 0) {
            return {};
        }

        try {
            const allKeuzeMenus = await this.getAllKeuzeMenus();
            const result = {};

            keuzeMenuIds.forEach(id => {
                if (allKeuzeMenus[id]) {
                    result[id] = allKeuzeMenus[id];
                }
            });

            return result;
        } catch (error) {
            console.error('Error fetching specific keuzeMenus:', error);
            throw error;
        }
    }

    /**
     * 创建新的选择菜单
     */
    async createKeuzeMenu(keuzeMenuData) {
        try {
            const dataToSave = {
                ...keuzeMenuData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            await databaseService.setData(`${this.keuzeMenusPath}/${keuzeMenuData.id}`, dataToSave);
            return keuzeMenuData.id;
        } catch (error) {
            console.error('Error creating keuzeMenu:', error);
            throw error;
        }
    }

    /**
     * 更新选择菜单
     */
    async updateKeuzeMenu(keuzeMenuId, updateData) {
        try {
            const dataToUpdate = {
                ...updateData,
                updatedAt: new Date().toISOString()
            };
            await databaseService.updateData(`${this.keuzeMenusPath}/${keuzeMenuId}`, dataToUpdate);
            return true;
        } catch (error) {
            console.error('Error updating keuzeMenu:', error);
            throw error;
        }
    }

    /**
     * 删除选择菜单
     */
    async deleteKeuzeMenu(keuzeMenuId) {
        try {
            await databaseService.removeData(`${this.keuzeMenusPath}/${keuzeMenuId}`);
            return true;
        } catch (error) {
            console.error('Error deleting keuzeMenu:', error);
            throw error;
        }
    }

    /**
     * 验证选项选择是否有效
     */
    validateOptionsSelection(keuzeMenus, selectedOptions) {
        const errors = [];

        Object.entries(keuzeMenus).forEach(([keuzeMenuId, keuzeMenu]) => {
            const selectedOption = selectedOptions[keuzeMenuId];

            // 检查必需选项
            if (keuzeMenu.required && !selectedOption) {
                errors.push(`${keuzeMenu.name} is verplicht`);
                return;
            }

            if (selectedOption) {
                // 检查单选/多选限制
                if (keuzeMenu.type === 'single_choice') {
                    if (Array.isArray(selectedOption)) {
                        errors.push(`${keuzeMenu.name} mag slechts één optie hebben`);
                    }
                } else if (keuzeMenu.type === 'multiple_choice') {
                    if (!Array.isArray(selectedOption)) {
                        errors.push(`${keuzeMenu.name} moet een array zijn voor meerdere selecties`);
                    } else if (keuzeMenu.maxSelections && selectedOption.length > keuzeMenu.maxSelections) {
                        errors.push(`${keuzeMenu.name} mag maximaal ${keuzeMenu.maxSelections} opties hebben`);
                    }
                }

                // 检查选项是否存在且可用
                const validateOption = (optionId) => {
                    const option = keuzeMenu.options?.find(opt => opt.id === optionId);
                    if (!option) {
                        errors.push(`Optie ${optionId} bestaat niet in ${keuzeMenu.name}`);
                    } else if (!option.available) {
                        errors.push(`Optie ${option.name} is momenteel niet beschikbaar`);
                    }
                };

                if (Array.isArray(selectedOption)) {
                    selectedOption.forEach(validateOption);
                } else {
                    validateOption(selectedOption);
                }
            }
        });

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * 计算选项的总价格
     */
    calculateOptionsPrice(keuzeMenus, selectedOptions) {
        let totalPrice = 0;

        Object.entries(selectedOptions).forEach(([keuzeMenuId, selectedOption]) => {
            const keuzeMenu = keuzeMenus[keuzeMenuId];
            if (!keuzeMenu) return;

            const calculateOptionPrice = (optionId) => {
                const option = keuzeMenu.options?.find(opt => opt.id === optionId);
                return option ? (option.price || 0) : 0;
            };

            if (Array.isArray(selectedOption)) {
                selectedOption.forEach(optionId => {
                    totalPrice += calculateOptionPrice(optionId);
                });
            } else {
                totalPrice += calculateOptionPrice(selectedOption);
            }
        });

        return totalPrice;
    }

    /**
     * 生成选项显示文本
     */
    generateOptionsDisplayText(keuzeMenus, selectedOptions) {
        const texts = [];

        console.log('=== generateOptionsDisplayText 调试 ===');
        console.log('keuzeMenus:', keuzeMenus);
        console.log('selectedOptions:', selectedOptions);

        Object.entries(selectedOptions).forEach(([keuzeMenuId, selectedOption]) => {
            const keuzeMenu = keuzeMenus[keuzeMenuId];
            if (!keuzeMenu) {
                console.log(`找不到keuzeMenu: ${keuzeMenuId}`);
                return;
            }

            console.log(`处理keuzeMenu: ${keuzeMenuId}`, keuzeMenu);
            console.log(`keuzeMenu.options:`, keuzeMenu.options);
            console.log(`选中的选项:`, selectedOption);

            const getOptionName = (optionId) => {
                console.log(`查找选项ID: ${optionId} 在选项列表中:`, keuzeMenu.options);

                if (!keuzeMenu.options || !Array.isArray(keuzeMenu.options)) {
                    console.log('选项列表不存在或不是数组');
                    return optionId;
                }

                const option = keuzeMenu.options.find(opt => {
                    console.log(`比较选项:`, opt, `opt.id: "${opt.id}" === "${optionId}" ?`, opt.id === optionId);
                    return opt.id === optionId;
                });

                console.log(`找到的选项:`, option);

                if (option && option.name) {
                    console.log(`返回选项名称: "${option.name}"`);
                    return option.name;
                } else {
                    console.log(`未找到选项或选项没有名称，返回ID: "${optionId}"`);
                    return optionId;
                }
            };

            if (Array.isArray(selectedOption)) {
                // 多选选项
                console.log('处理多选选项');
                const optionNames = selectedOption.map(getOptionName).filter(name => name);
                console.log('多选选项名称列表:', optionNames);
                if (optionNames.length > 0) {
                    // 显示菜单名称和选项名称
                    const displayText = `${keuzeMenu.name}: ${optionNames.join(', ')}`;
                    console.log('添加多选文本:', displayText);
                    texts.push(displayText);
                }
            } else if (selectedOption) {
                // 单选选项
                console.log('处理单选选项');
                const optionName = getOptionName(selectedOption);
                console.log('单选选项名称:', optionName);

                if (optionName) {
                    // 始终显示菜单名称和选项名称的组合
                    const displayText = `${keuzeMenu.name}: ${optionName}`;
                    console.log('添加单选文本:', displayText);
                    texts.push(displayText);
                }
            }
        });

        console.log('最终生成的文本数组:', texts);
        console.log('=====================================');

        return texts;
    }
}

export default new KeuzeMenuService();