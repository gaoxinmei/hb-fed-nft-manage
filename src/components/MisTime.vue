<template>
    <DatePicker
        v-model="currentTime"
        @on-change="timeChange"
        :options="timeOption"
        :type="dateType"
        :format="dataFormat"
        :placeholder="$t('common.PlzSelectDate')"></DatePicker>
    <!-- <MisTime :date="searchParms.date" format="YYYY-MM-DD" dateType="date" :disableAfter=true @time-change="timeChange"></MisTime> -->
    <!-- <MisTime :date="detailInfo.auditTime"  dateType="datetime" dataFormat="yyyy-MM-dd HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" @time-change="dateChange"></MisTime> -->

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
        // 禁用今天选择
        disableToday: {
            type: Boolean,
            default: false,
        },
        // 禁用今天以后的日期
        disableAfter: {
            type: Boolean,
            default: false,
        },
        date: {
            type: String,
            default: '',
        },
        format: {
            type: String,
            default: 'YYYY-MM-DD HH:mm:ss',
        },
        dataFormat: {
            type: String,
            default: 'YYYY-MM-DD HH:mm:ss',
        },
        dateType: {
            type: String,
            default: 'date',
        },
    },
    data() {
        return {
            currentTime: '',
            currentTimeVal: '',
            timeOption: {
                disabledDate: (date) => {
                    const curDate = getTimeByTz(date);
                    const yesterdayStamp = getYesterdayTimeByTz();
                    if (this.disableToday) {
                        return curDate && curDate >= yesterdayStamp;
                    } else if (this.disableAfter) {
                        return curDate && curDate >= (yesterdayStamp + ((24 * 3600) * 1000));
                    }
                    return false;
                },
            },
        };
    },
    methods: {
        timeChange(val) {
            let time;
            if (val) {
                time = formatTimeByTz(val, this.format);
            } else {
                time = '';
            }
            this.currentTimeVal = time;
            this.$emit('time-change', time);
        },
    },
    mounted() {
        if (this.date) {
            const temp = new Date(this.date);
            if (!isNaN(temp.getTime())) {
                this.currentTime = temp;
            }
        }
    },
};
</script>
