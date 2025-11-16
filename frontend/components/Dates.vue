<template>
    <div v-if="props.dateRange === true && props.abbreviate === false">
        <span
            >{{ dateMonthDay(props.startDate, locale) }} -
            {{ dateFull(props.endDate, locale) }}</span
        >
    </div>
    <div v-else-if="props.dateRange && props.abbreviate === true">
        <span
            >{{ dateAbbreviate(props.startDate, false, locale) }} -
            {{ dateAbbreviate(props.endDate, props.year, locale) }}</span
        >
    </div>
    <div v-else-if="props.hour === true">
        <span
            >{{ dateWithHour(props.startDate, locale)
            }}{{
                props.endDate ? ` - ${dateWithHour(props.endDate, locale)}` : ''
            }}</span
        >
    </div>
    <div v-else>
        <span>{{ dateMonthDay(props.startDate, locale) }}</span>
    </div>
</template>

<script lang="ts" setup>
import {
    dateMonthDay,
    dateFull,
    dateAbbreviate,
    dateWithHour,
} from '~/composables/dates'

// Get the current locale from i18n
const { locale } = useI18n()

const props = defineProps<{
    startDate: string
    dateRange?: boolean
    endDate?: string
    abbreviate?: boolean
    year?: boolean
    hour?: boolean
}>()
</script>

<style></style>
