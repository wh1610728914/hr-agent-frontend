<template>
    
    <el-card >
    <template #header>
      <div class="card-header">
        <span>员工管理</span>
      </div>
    </template>
    
    <div>
        <el-select placeholder="请选择部门进行查询" 
            style="width:200px;margin:0 10px"
            v-model="paginationData.department_id"
            clearable
            @change="handleSearch"
            @clear="handleSearch"
        >
            <el-option
                v-for="item in labOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
        </el-select>
    </div>
    <el-table border :data="tableData" style="width: 100%;margin: 10px 0; " v-loading="tableLoading">
        <el-table-column 
            v-for="item in tableColumns" 
            :prop="item.prop" 
            :label="item.label" 
            :min-width="item.width">
            <template #default="{row}">
                <span v-if="item.prop === 'status'">
                    <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                        {{ row.status === 1 ? '正常' : '禁用' }}
                    </el-tag>
                </span>
                <span v-if="item.type === 'bool'">
                    {{ !row[item.prop] ? '否' : '是' }}
                </span>
                <span v-if="item.type === 'time'">
                   {{ row[item.prop] ? dayjs(row[item.prop]).format('YYYY-MM-DD') : '-' }}
                </span>
                
            </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="120">
            <template #default="{row}">
                <el-button link type="primary" size="small" @click="handleUpdate(row)">
                    编辑
                </el-button>
                <el-button link type="primary" size="small" @click="handelDelete(row)">删除</el-button>
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
  <el-dialog v-model="dialogFormVisible" :title="dialogForm.id ? '编辑设备':'新增设备'" width="500">
    <el-form :model="dialogForm" label-position="left" label-width="auto" :rules="rules" ref="dialogRef">
      <el-form-item label="设备名称" prop="name">
        <el-input v-model="dialogForm.name"  />
      </el-form-item>
      <el-form-item label="图片" >
        <el-upload
            class="avatar-uploader"
            :http-request="handleUploadAvatar"
            :show-file-list="false"
            accept="image/jpeg,image/png,image/gif,image/webp"
            :before-upload="beforeAvatarUpload"
        >
            <el-avatar shape="square"  :src="dialogForm.img" />
        </el-upload>
        
      </el-form-item>
      <el-form-item label="设备描述" >
        <el-input v-model="dialogForm.description"  />
      </el-form-item>
      <el-form-item label="所属实验室" prop="lab_id">
       
        <el-select v-model="dialogForm.lab_id">
            <el-option
                v-for="item in labOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            />
        </el-select>
      </el-form-item>
      <el-form-item label="型号规格" >
        <el-input v-model="dialogForm.spec"/>
      </el-form-item>
      <el-form-item label="数量" >
        <el-input-number v-model="dialogForm.quantity" :min="1"/>
      </el-form-item>
      <el-form-item label="状态" >
        <el-select v-model="dialogForm.status" placeholder="Select" style="width: 240px">
            <el-option
                key="0"
                label="禁用"
                :value="0"
            />
            <el-option
                key="1"
                label="启用"
                :value="1"
            />
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
// import {getEquipAll,createEquip,updateEquip,deleteEquip} from '@/api/equip_api'
import { dayjs, ElMessage,ElMessageBox } from 'element-plus';
// import { updateFileApi } from '@/api/file_api';
import {getUserList} from '@/api/user'
const tableColumns = [
    {
        prop:'username',
        label:'用户名',
        width:'100px'
    },
    {
        prop:'realname',
        label:'姓名',
        width:'100px'
    },
    {
        prop:'email',
        label:'邮箱',
        width:'200px'
    },
    {
        prop:'department',
        label:'部门',
        width:'100px'
    },
    {
        prop:'create_at',
        label:'入职时间',
        width:'150px',
        type:'time'
    },
    {
        prop:'is_hr',
        label:'是否HR',
        width:'100px',
        type:"bool"
    },
    {
        prop:'is_superuser',
        label:'是否部门Leader',
        width:'150px',
        type:"bool"
    },
    {
        prop:'status',
        label:'状态',
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
    name:'',
    description:'',
    img:'',
    spec:'',
    quantity:0,
    status:1,
    
})
const labOptions = ref([])
const rules = reactive({
  name: [
    { required: true, message: '请输入实验室名称', trigger: 'blur' },
    { min: 3, max: 5, message: '用户名长度应在 3 到 5 个字符之间', trigger: 'blur' }
  ],
  lab_id:[
    {required: true, message: '请选择所属实验室', trigger: 'blur'}
  ]
})
const paginationData = reactive({
    page:1,
    size:10,
    department_id:'',
    
})
const loadLabOptions = async () => {
    const res = await getDepartmentList({page:1,size:10})
    labOptions.value = res.data?.list
    console.log('ss',labOptions.value);
    
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
        const res = await getUserList(paginationData)
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
    resetForm({
        id:equip.id,
        name:equip.name,
        description:equip.description,
        img:equip.img,
        lab_id:equip.lab_id,
        spec:equip.spec,
        quantity:equip.quantity,
        status:equip.status
    })
    // console.log(equip);
    
}
const handleSave = async () => {
    const valid = await dialogRef.value.validate().catch(() => false)
    if(!valid) return
    dialogLoading.value = true
    try {
        const res = dialogForm.id ? 
                await updateEquip({'lab_id':dialogForm.id,...dialogForm}) : 
                await createEquip({...dialogForm})
        if(res.code === 200){
            ElMessage.success(dialogForm.id ? '编辑成功' : '新增成功')
            getAllInfo()
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
