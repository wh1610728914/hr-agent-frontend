<template>
    
    <el-card >
    <template #header>
      <div class="card-header">
        <span>职位管理</span>
      </div>
    </template>
    
    <el-table border :data="tableData" style="width: 100%;margin: 10px 0; " v-loading="tableLoading">
        <el-table-column 
            v-for="item in tableColumns" 
            :prop="item.prop" 
            :label="item.label" 
            :min-width="item.width">
            <template #default="{row}">
                <span v-if="item.prop === 'status'">
                    <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'danger'">
                        {{ row.status === 'ACTIVE' ? '正常' : '禁用' }}
                    </el-tag>
                </span>
                <span v-if="item.type === 'bool'">
                    {{ !row[item.prop] ? '否' : '是' }}
                </span>
                <span v-if="item.type === 'time'">
                   {{ row[item.prop] ? dayjs(row[item.prop]).format('YYYY-MM-DD') : '-' }}
                </span>
                <span v-if="item.prop === 'departmentName'">
                   {{ row.department.name }}
                </span>
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="60">
            <template #default="{row}">
                <el-button link type="primary" size="small" @click="handleUpdate(row)">
                    编辑
                </el-button>
                
            </template>
        </el-table-column>
    </el-table>
    <div style="display: flex;justify-content: flex-end;">
        <el-pagination 
            :page-size="paginationData.size"
            layout="total,prev, pager, next"
            :total="total"
            background 
            size='small'
            :current-page="paginationData.page"
            @current-change="changeCurrent"
        />
    </div>
  </el-card>
    <el-dialog v-model="dialogFormVisible" :title="dialogForm.id ? '编辑员工':'新增员工'" width="500">
        <el-form :model="dialogForm" label-position="left" label-width="auto" :rules="rules" ref="dialogRef">
            
            <!-- 1. 用户名 -->
            <el-form-item label="用户名" prop="username">
            <el-input v-model="dialogForm.username" />
            </el-form-item>

            <!-- 2. 姓名 -->
            <el-form-item label="姓名" prop="realname">
            <el-input v-model="dialogForm.realname" />
            </el-form-item>

            <!-- 3. 邮箱 -->
            <el-form-item label="邮箱" prop="email">
            <el-input v-model="dialogForm.email" />
            </el-form-item>

            <!-- 4. 部门 -->
            <el-form-item label="部门" prop="departmentName">
                <el-select placeholder="请选择部门进行查询" 
                    style="width:200px;margin:0 10px"
                    v-model="dialogForm.departmentId"
                    
                >
                    <el-option
                        v-for="item in labOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>

          
            

            <!-- 6. 是否HR -->
            <el-form-item label="是否HR" prop="is_hr">
            <el-switch v-model="dialogForm.is_hr" />
            </el-form-item>

            <!-- 7. 是否部门Leader -->
            <el-form-item label="是否部门Leader" prop="is_superuser">
            <el-switch v-model="dialogForm.is_superuser" />
            </el-form-item>

            <!-- 8. 状态 -->
            <el-form-item label="状态" prop="status">
                <!-- 假设状态用下拉框 -->
                <el-select v-model="dialogForm.status" placeholder="请选择状态" style="width: 100%">
                    <el-option label="正常" value="ACTIVE" />
                    <el-option label="锁定" value="BLOCKED" />
                    <el-option label="离职" value="RESIGNED" />
                </el-select>
            </el-form-item>
            
        </el-form>

        <template #footer>
            <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSave" :loading="dialogLoading">
                提交
            </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import {getDepartmentList} from '@/api/department'
import { dayjs, ElMessage,ElMessageBox } from 'element-plus';
// import { updateFileApi } from '@/api/file_api';
import {getUserList,updateUserStatus} from '@/api/user'
import {getPositionListApi}from '@/api/position'

const tableColumns = [
    {
        prop:'title',
        label:'标题',
        width:'100px'
    },
    {
        prop:'department',
        label:'部门',
        width:'100px'
    },
    {
        prop:'salary',
        label:'薪资范围',
        width:'200px'
    },
    {
        prop:'recruitment_count',
        label:'招聘人数',
        width:'100px'
    },
    {
        prop:'education',
        label:'学历要求',
        width:'150px',
        type:'time'
    },
    {
        prop:'work_year',
        label:'工作年限',
        width:'100px',
        type:"bool"
    },
    {
        prop:'publicer',
        label:'发布者',
        width:'150px',
        type:"bool"
    },
    {
        prop:'status',
        label:'是否开放',
        width:'100px'
    },
    {
        prop:'status',
        label:'创建时间',
        width:'100px'
    },
    
]
const tableLoading = ref(false)
const dialogFormVisible = ref(false)
const dialogLoading = ref(false)
const dialogRef = ref(null)
let tableData = reactive([])
const total = ref(0)
const dialogForm = reactive({
  id: null,
  username: '',
  realname: '',
  email: '',
  departmentId: '',
  create_at: '',
  is_hr: false,
  is_superuser: false,
  status: 'NORMAL', // 或 0/1，看你后端的定义
})
const labOptions = ref([])
// 2. 表单校验规则（对应你表单里的必填项）
const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  realname: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ],
  departmentId: [{ required: true, message: '请输入或选择部门', trigger: 'change' }],
  create_at: [{ required: true, message: '请选择入职时间', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
})
const paginationData = reactive({
    page:1,
    size:10,
    department_id:'',
    
})
const loadLabOptions = async () => {
    const res = await getDepartmentList({page:1,size:10})
    labOptions.value = res.data?.list
}
const handleSearch = () => {
    getAllInfo()
}
// 获取所有数据
const getAllInfo = async () => {
    tableLoading.value = true
    tableData = reactive([])
    try{
        console.log(paginationData);
        const res = await getPositionListApi(paginationData)
        if(res.code === 200){
            tableData = res.data?.list
            total.value = res.data?.total
            
        }
    } finally {
        tableLoading.value = false
    }
}

const changeCurrent = (val) => {
    paginationData.page = val
    getAllInfo()
}
// 重置
const resetForm = (obj) => {
    Object.assign(dialogForm,obj)
}
// 新增用户
const handleCreate = () => {
    dialogFormVisible.value = true
    resetForm({
        id:'',
        name:'',
        description:'',
        img:'',
        spec:'',
        quantity:0,
        status:1,
        lab_id:'',
    })
   
}

// 删除
const handelDelete = async (equip) => {
    ElMessageBox.confirm(
        `是否确认删除实验设备-${equip.name}`,
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
    .then(async () => {
        const res = await deleteEquip({'id':equip.id})
        if(res.code === 200){
            ElMessage.success('已成功删除')
            getAllInfo()
        }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除',
      })
    })
}
// 编辑
const handleUpdate = async(equip) => {
    dialogFormVisible.value = true
    console.log(equip);
    
    resetForm({
        id: equip.id,
        username: equip.username,           // 对应原 equip.username
        realname: equip.realname,           // 新增：姓名
        email: equip.email,                 // 新增：邮箱
        departmentId: equip.department.id, // 替换原 description（设备描述）
        create_at: equip.create_at,         // 替换原 lab_id（所属实验室）或新增
        is_hr: equip.is_hr,                 // 替换原 img 等字段
        is_superuser: equip.is_superuser,   // 替换原 spec 等字段
        status: equip.status                // 保持不变（对应员工状态）
    })
    // console.log(equip);
    
}
const handleSave = async () => {
    const valid = await dialogRef.value.validate().catch(() => false)
    if(!valid) return
    dialogLoading.value = true
    try {
        // const res = dialogForm.id ? 
                // await updateUserStatus({'user_id':dialogForm.id,...dialogForm})  
                // await createEquip({...dialogForm})
        if(res.code === 200){
            ElMessage.success(dialogForm.id ? '编辑成功' : '新增成功')
            getAllInfo()
        }else{
            ElMessage.warning(res.message || '不可编辑')
        }
    } finally {
        dialogLoading.value = false
    }
}

onMounted(()=>{
    loadLabOptions()
    getAllInfo()
})

</script>
