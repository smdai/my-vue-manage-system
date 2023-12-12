<template>
    <div class="container">
        <el-container>
            <el-aside width="700px" class="container">
                <div class="handle-box">
                    <el-row :gutter="50" justify="center">
                        <el-col :span="10">
                            <el-form-item label="数据字典编码：">
                                <el-input v-model="catalogQuery.itemCatalogCode" placeholder="请输入编码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="数据字典名称：">
                                <el-input v-model="catalogQuery.itemCatalogName" placeholder="请输入名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row justify="center">
                        <el-col :span="8" class="center-buttons">
                            <el-button type="primary" :icon="Search" @click="handleCatalogSearch">搜索</el-button>
                            <el-button type="primary" :icon="Switch" @click="clearCatalogQuery">重置</el-button>
                        </el-col>
                    </el-row>
                </div>
                <div class="handle-box">
                    <el-button type="primary" :icon="Plus" @click="add"
                        v-if="buttonVisiableMap.get('catalogAdd')">新增</el-button>
                    <el-button type="primary" :icon="Edit" @click="edit"
                        v-if="buttonVisiableMap.get('catalogEdit')">编辑</el-button>
                    <el-button type="danger" :icon="Delete" @click="del"
                        v-if="buttonVisiableMap.get('catalogDelete')">删除</el-button>
                </div>

                <el-table :data="catalogTableData" border class="table" ref="multipleTable"
                    header-cell-class-name="table-header" @row-click="handleCatalogRowClick"
                    :current-row="currentCatalogRow" highlight-current-row>
                    <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                    <el-table-column prop="itemCatalogCode" label="数据字典编码"></el-table-column>
                    <el-table-column prop="itemCatalogName" label="数据字典名称"></el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination background layout="total, prev, pager, next" :current-page="catalogQuery.pageIndex"
                        :page-size="catalogQuery.pageSize" :total="catalogPageTotal"
                        @current-change="handleCatalogPageChange"></el-pagination>
                </div>
                <!-- 编辑弹出框 -->
                <el-dialog title="编辑" v-model="editCatalogVisible" width="40%">
                    <el-form :model="catalogForm" :rules="catalogRules" ref="editCatalogForm" label-width="110px">
                        <el-form-item label="id" v-if="false">
                            <el-input v-model="catalogForm.id" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="数据字典编码" prop="itemCatalogCode">
                            <el-input v-model="catalogForm.itemCatalogCode" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="数据字典名称" prop="itemCatalogName">
                            <el-input v-model="catalogForm.itemCatalogName"></el-input>
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="editCatalogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="saveEdit(editCatalogForm)">确 定</el-button>
                        </span>
                    </template>
                </el-dialog>
            </el-aside>
            <el-main class="container">
                <div class="handle-box">
                    <el-row :gutter="50" justify="center">
                        <el-col :span="10">
                            <el-form-item label="字典编码：">
                                <el-input v-model="libraryQuery.itemCode" placeholder="请输入编码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="字典名称：">
                                <el-input v-model="libraryQuery.itemName" placeholder="请输入名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row justify="center">
                        <el-col :span="8" class="center-buttons">
                            <el-button type="primary" :icon="Search" @click="handleLibrarySearch">搜索</el-button>
                            <el-button type="primary" :icon="Switch" @click="clearLibraryQuery">重置</el-button>
                        </el-col>
                    </el-row>
                </div>
                <div class="handle-box">
                    <el-button type="primary" :icon="Plus" @click="addLibrary"
                        v-if="buttonVisiableMap.get('libraryAdd')">新增</el-button>
                    <el-button type="primary" :icon="Edit" @click="editLibrary"
                        v-if="buttonVisiableMap.get('libraryEdit')">编辑</el-button>
                    <el-button type="danger" :icon="Delete" @click="delLibrary"
                        v-if="buttonVisiableMap.get('libraryDelete')">删除</el-button>
                    <el-button type="primary" :icon="Refresh" @click="refresh"
                        v-if="buttonVisiableMap.get('libraryRefresh')">刷新缓存</el-button>
                </div>

                <el-table :data="libraryTableData" border class="table" ref="multipleTable"
                    header-cell-class-name="table-header" @row-click="handleLibraryRowClick"
                    :current-row="currentLibraryRow" highlight-current-row>
                    <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                    <el-table-column prop="itemCode" label="字典编码"></el-table-column>
                    <el-table-column prop="itemName" label="字典名称"></el-table-column>
                    <el-table-column prop="sortNo" label="排序号" width="80px"></el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination background layout="total, prev, pager, next" :current-page="libraryQuery.pageIndex"
                        :page-size="libraryQuery.pageSize" :total="libraryPageTotal"
                        @current-change="handleLibraryPageChange"></el-pagination>
                </div>
                <!-- 编辑弹出框 -->
                <el-dialog title="编辑" v-model="editLibraryVisible" width="40%">
                    <el-form :model="libraryForm" :rules="libraryRules" ref="editLibraryForm" label-width="110px">
                        <el-form-item label="id" v-if="false">
                            <el-input v-model="libraryForm.id" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="数据字典编码" prop="itemCatalogCode">
                            <el-input v-model="libraryForm.itemCatalogCode" disabled></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="数据字典名称" prop="itemCatalogName">
                            <el-input v-model="libraryForm.itemCatalogName" disabled></el-input>
                        </el-form-item> -->
                        <el-form-item label="字典编码" prop="itemCode">
                            <el-input v-model="libraryForm.itemCode"></el-input>
                        </el-form-item>
                        <el-form-item label="字典名称" prop="itemName">
                            <el-input v-model="libraryForm.itemName"></el-input>
                        </el-form-item>
                        <el-form-item label="排序号" prop="sortNo">
                            <el-input v-model="libraryForm.sortNo"></el-input>
                        </el-form-item>
                    </el-form>
                    <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="editLibraryVisible = false">取 消</el-button>
                            <el-button type="primary" @click="saveLibraryEdit(editLibraryForm)">确 定</el-button>
                        </span>
                    </template>
                </el-dialog>
            </el-main>
        </el-container>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus, Switch, Refresh } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import { errorInfo } from '../../constants/error';
import { fetchCatalogData, insertCatalog, updateCatalog, deleteCatalog } from '../../api/codecatalog';
import { fetchLibraryData, insertLibrary, updateLibrary, deleteLibrary, refreshLibrary } from '../../api/codelibrary';
import { getControlVisiableMap } from '../../method/common';
let buttonVisiableMap = getControlVisiableMap(['catalogAdd', 'catalogEdit', 'catalogDelete', 'libraryAdd', 'libraryEdit', 'libraryDelete', 'libraryRefresh'])
const catalogQuery = reactive({
    itemCatalogCode: '',
    itemCatalogName: '',
    pageIndex: 1,
    pageSize: 10
});
let catalogForm = reactive({
    id: '',
    itemCatalogCode: '',
    itemCatalogName: ''
});
const editCatalogForm = ref<FormInstance>();
const catalogRules: FormRules = {
    itemCatalogCode: [
        { required: true, message: "请输入数据字典编码" }
    ],
    itemCatalogName: [
        { required: true, message: "请输入数据字典名称" }
    ]
};
let currentCatalogRow: any = null;// 用于存储当前选中的行数据
const handleCatalogRowClick = (row: []) => {
    // 通过row-click事件获取当前点击的行数据
    currentCatalogRow = row;
    clearLibraryQueryCondition()
    libraryQuery.itemCatalogCode = currentCatalogRow.itemCatalogCode;
    getLibraryData()
};
const catalogTableData = ref<TableItem[]>([]);
const catalogPageTotal = ref(0);
const editCatalogVisible = ref(false);
const getCatalogData = () => {
    fetchCatalogData(
        JSON.stringify(catalogQuery)
    ).then(res => {
        catalogTableData.value = res.data.data;
        catalogPageTotal.value = res.data.total;
    });
    currentCatalogRow = null
}
getCatalogData();
interface TableItem {
    id: number;
    itemCatalogCode: string;
    itemCatalogName: string;
}
const insertOrUpdate = ref('')
// 查询操作
const handleCatalogSearch = () => {
    catalogQuery.pageIndex = 1;
    getCatalogData()
};
// 重置操作
const clearCatalogQuery = () => {
    catalogQuery.itemCatalogCode = '';
    catalogQuery.itemCatalogName = '';
    catalogQuery.pageIndex = 1;
    getCatalogData()
};
const handleCatalogPageChange = (val: number) => {
    catalogQuery.pageIndex = val;
    getCatalogData();
};
const add = () => {
    editCatalogVisible.value = true;
    catalogForm.id = '';
    catalogForm.itemCatalogCode = '';
    catalogForm.itemCatalogName = '';
    insertOrUpdate.value = '1';
}
const edit = () => {
    if (!currentCatalogRow) {
        ElMessage.warning('请选择一条数据')
        return
    }
    catalogForm.id = currentCatalogRow.id;
    catalogForm.itemCatalogCode = currentCatalogRow.itemCatalogCode;
    catalogForm.itemCatalogName = currentCatalogRow.itemCatalogName;
    editCatalogVisible.value = true;
    insertOrUpdate.value = '2';
}
const del = () => {
    if (!currentCatalogRow) {
        ElMessage.warning('请选择一条数据')
        return
    }
    // 二次确认删除
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning'
    })
        .then(() => {
            catalogForm.id = currentCatalogRow.id;
            deleteCatalog(
                catalogForm
            ).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success('删除成功');
                    getCatalogData()
                } else {
                    ElMessage.error(errorInfo.deleteError)
                }
            });
        })
        .catch(() => { });
}
const saveEdit = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid: boolean) => {
        if (valid) {
            if (insertOrUpdate.value === '1') {
                insertCatalog(
                    catalogForm
                ).then(res => {
                    if (res.data.code === 200) {
                        ElMessage.success('新增成功');
                        getCatalogData()
                    } else {
                        ElMessage.error(errorInfo.addError)
                    }
                });
            } else if (insertOrUpdate.value === '2') {
                updateCatalog(
                    catalogForm
                ).then(res => {
                    if (res.data.code === 200) {
                        ElMessage.success('更新成功');
                        getCatalogData()
                    } else {
                        ElMessage.error(errorInfo.updateError)
                    }
                });
            }
            editCatalogVisible.value = false;
        }
    });
};
// ----------------------------------------------------------------------------------------
const libraryPageTotal = ref(0);
const editLibraryVisible = ref(false);
const editLibraryForm = ref<FormInstance>();
let currentLibraryRow: any = null;// 用于存储当前选中的行数据
const handleLibraryRowClick = (row: []) => {
    // 通过row-click事件获取当前点击的行数据
    currentLibraryRow = row;
};
const libraryRules: FormRules = {
    itemCatalogCode: [
        { required: true, message: "请输入数据字典编码" }
    ],
    itemCatalogName: [
        { required: true, message: "请输入数据字典名称" }
    ],
    itemCode: [
        { required: true, message: "请输入字典编码" }
    ],
    itemName: [
        { required: true, message: "请输入字典名称" }
    ],
    sortNo: [
        { required: true, message: "请输入排序号" }
    ]
};
const libraryInsertOrUpdate = ref('')
interface LibraryTableItem {
    id: number;
    itemCatalogCode: string;
    itemCatalogName: string;
    itemCode: string;
    itemName: string;
}
const libraryTableData = ref<LibraryTableItem[]>([]);
const libraryQuery = reactive({
    itemCatalogCode: '',
    itemCode: '',
    itemName: '',
    pageIndex: 1,
    pageSize: 10
});
let libraryForm = reactive({
    id: '',
    itemCatalogCode: '',
    itemCatalogName: '',
    itemCode: '',
    itemName: '',
    sortNo: ''
});
const getLibraryData = () => {
    fetchLibraryData(
        JSON.stringify(libraryQuery)
    ).then(res => {
        libraryTableData.value = res.data.data;
        libraryPageTotal.value = res.data.total;
    });
    currentLibraryRow = null
}
getLibraryData();
// 查询操作
const handleLibrarySearch = () => {
    libraryQuery.pageIndex = 1;
    getLibraryData()
};
// 重置操作
const clearLibraryQuery = () => {
    clearLibraryQueryCondition()
    getLibraryData()
};
const clearLibraryQueryCondition = () => {
    libraryQuery.itemCatalogCode = '';
    libraryQuery.itemCode = '';
    libraryQuery.itemName = '';
    libraryQuery.pageIndex = 1;
}
const addLibrary = () => {
    editLibraryVisible.value = true;
    libraryForm.id = '';
    libraryForm.itemCode = '';
    libraryForm.itemName = '';
    libraryForm.sortNo = '';
    libraryForm.itemCatalogCode = currentCatalogRow.itemCatalogCode;
    libraryInsertOrUpdate.value = '1';
}
const editLibrary = () => {
    if (!currentLibraryRow) {
        ElMessage.warning('请选择一条数据')
        return
    }
    libraryForm.id = currentLibraryRow.id;
    libraryForm.itemCatalogCode = currentLibraryRow.itemCatalogCode;
    libraryForm.itemCatalogName = currentLibraryRow.itemCatalogName;
    libraryForm.itemCode = currentLibraryRow.itemCode;
    libraryForm.itemName = currentLibraryRow.itemName;
    libraryForm.sortNo = currentLibraryRow.sortNo;
    editLibraryVisible.value = true;
    libraryInsertOrUpdate.value = '2';
}
const delLibrary = () => {
    if (!currentLibraryRow) {
        ElMessage.warning('请选择一条数据')
        return
    }
    // 二次确认删除
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning'
    })
        .then(() => {
            libraryForm.id = currentLibraryRow.id;
            deleteLibrary(
                libraryForm
            ).then(res => {
                if (res.data.code === 200) {
                    ElMessage.success('删除成功');
                    getLibraryData()
                } else {
                    ElMessage.error(errorInfo.deleteError)
                }
            });
        })
        .catch(() => { });
}
const handleLibraryPageChange = (val: number) => {
    libraryQuery.pageIndex = val;
    getLibraryData();
};
const saveLibraryEdit = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.validate((valid: boolean) => {
        if (valid) {
            if (libraryInsertOrUpdate.value === '1') {
                insertLibrary(
                    libraryForm
                ).then(res => {
                    if (res.data.code === 200) {
                        ElMessage.success('新增成功');
                        getLibraryData()
                    } else {
                        ElMessage.error(errorInfo.addError)
                    }
                });
            } else if (libraryInsertOrUpdate.value === '2') {
                updateLibrary(
                    libraryForm
                ).then(res => {
                    if (res.data.code === 200) {
                        ElMessage.success('更新成功');
                        getLibraryData()
                    } else {
                        ElMessage.error(errorInfo.updateError)
                    }
                });
            }
            editLibraryVisible.value = false;
        }
    });
};
const refresh = () => {
    refreshLibrary().then(
        res => {
            if (res.data.code === 200) {
                ElMessage.success('刷新缓存成功');
                getLibraryData()
            } else {
                ElMessage.error('刷新缓存失败')
            }
        }
    )
}
</script>
<style scoped>
@import '../../assets/css/list.css';
</style>