<template>
    <DatePicker 
        :type="dateType" 
        :editable="false" 
        v-model="dateRange" 
        split-panels 
        :placeholder="$t('Date')" 
        :format="formatDate"
        @on-change="timeChange"
        :clearable="clearable"
        ></DatePicker>
        <!-- <MisTimeRange :startDate="searchParams.startDate" :endDate="searchParams.endDate" dateType="datetimerange" formatDate="yyyy-MM-dd HH:mm"  @time-change="timeChange" style="width:200px;"></MisTimeRange> -->
        <!-- <MisTimeRange :startDate="searchParams.startDate" :endDate="searchParams.endDate" dateType="daterange" formatDate="yyyy-MM-dd"  @time-change="timeChange" style="width:200px;"></MisTimeRange> -->
</template>
<script>
import {
    getTimeByTz,
    getYesterdayTimeByTz,
    formatTimeByTz
} from '@/util/tools';

export default {
    name: 'MisDate',
    props: {
        startDate: {
            type: String,
            default: '',
        },
        endDate: {
            type: String,
            default: '',
        },
        formatDate: {
            type: String,
            default: 'yyyy-MM-dd',
        },
        dateType: {
            type: String,
            default: 'daterange',
        },
        clearable: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            dateRange:[]
        };
    },
    watch: {
        startDate: {
            deep: true,
            immediate: true,
            handler(newV,oldV) {
                if(this.startDate && this.endDate){
                    this.dateRange = [this.startDate,this.endDate];
                }else{
                    this.dateRange = [];
                }
            }
        }
    },
    methods: {
        timeChange(val){
            let startTime = '';
            let endTime = '';
            if (this.dateRange[0].length != 0) {
                startTime = formatTimeByTz(this.dateRange[0], this.formatDate.toUpperCase());
                endTime = formatTimeByTz(this.dateRange[1], this.formatDate.toUpperCase());
            } 
            this.$emit('time-change', startTime, endTime);
        }
    },
    mounted() {
    },
};
</script>
