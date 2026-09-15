import { Injectable } from '@angular/core';
import { style as datepicker_style } from './datepicker.css';
import { BaseStyle } from '@gravionlabs/helix-core/base';

const style = /*css*/ `
${datepicker_style}

/* For Helix */
.h-datepicker.ng-invalid.ng-dirty .h-inputtext {
    border-color: dt('inputtext.invalid.border.color');
}
`;

const inlineStyles = {
    root: () => ({ position: 'relative' })
};

const classes = {
    root: ({ instance }) => [
        'h-datepicker h-component h-inputwrapper',
        {
            'h-invalid': instance.invalid(),
            'h-datepicker-fluid': instance.hasFluid,
            'h-inputwrapper-filled': instance.$filled(),
            'h-variant-filled': instance.$variant() === 'filled',
            'h-inputwrapper-focus': instance.focus || instance.overlayVisible,
            'h-focus': instance.focus || instance.overlayVisible
        }
    ],
    pcInputText: 'h-datepicker-input',
    dropdown: 'h-datepicker-dropdown',
    inputIconContainer: 'h-datepicker-input-icon-container',
    inputIcon: 'h-datepicker-input-icon',
    panel: ({ instance }) => [
        'h-datepicker-panel h-component',
        {
            'h-datepicker-panel h-component': true,
            'h-datepicker-panel-inline': instance.inline,
            'h-disabled': instance.$disabled(),
            'h-datepicker-timeonly': instance.timeOnly
        }
    ],
    calendarContainer: 'h-datepicker-calendar-container',
    calendar: 'h-datepicker-calendar',
    header: 'h-datepicker-header',
    pcPrevButton: 'h-datepicker-prev-button',
    title: 'h-datepicker-title',
    selectMonth: 'h-datepicker-select-month',
    selectYear: 'h-datepicker-select-year',
    decade: 'h-datepicker-decade',
    pcNextButton: 'h-datepicker-next-button',
    dayView: 'h-datepicker-day-view',
    weekHeader: 'h-datepicker-weekheader h-disabled',
    weekNumber: 'h-datepicker-weeknumber',
    weekLabelContainer: 'h-datepicker-weeklabel-container h-disabled',
    weekDayCell: 'h-datepicker-weekday-cell',
    weekDay: 'h-datepicker-weekday',
    dayCell: ({ date }) => [
        'h-datepicker-day-cell',
        {
            'h-datepicker-other-month': date.otherMonth,
            'h-datepicker-today': date.today
        }
    ],
    day: ({ instance, date }) => {
        let selectedDayClass = '';

        if (instance.isRangeSelection() && instance.isSelected(date) && date.selectable) {
            const startDate = instance.value[0];
            const endDate = instance.value[1];

            const isStart = startDate && date.year === startDate.getFullYear() && date.month === startDate.getMonth() && date.day === startDate.getDate();
            const isEnd = endDate && date.year === endDate.getFullYear() && date.month === endDate.getMonth() && date.day === endDate.getDate();

            selectedDayClass = isStart || isEnd ? 'h-datepicker-day-selected' : 'h-datepicker-day-selected-range';
        }

        return {
            'h-datepicker-day': true,
            'h-datepicker-day-selected': !instance.isRangeSelection() && instance.isSelected(date) && date.selectable,
            'h-disabled': instance.$disabled() || !date.selectable,
            [selectedDayClass]: true
        };
    },
    monthView: 'h-datepicker-month-view',
    month: ({ instance, index }) => [
        'h-datepicker-month',
        {
            'h-datepicker-month-selected': instance.isMonthSelected(index),
            'h-disabled': instance.isMonthDisabled(index)
        }
    ],
    yearView: 'h-datepicker-year-view',
    year: ({ instance, year }) => [
        'h-datepicker-year',
        {
            'h-datepicker-year-selected': instance.isYearSelected(year),
            'h-disabled': instance.isYearDisabled(year)
        }
    ],
    timePicker: 'h-datepicker-time-picker',
    hourPicker: 'h-datepicker-hour-picker',
    pcIncrementButton: 'h-datepicker-increment-button',
    pcDecrementButton: 'h-datepicker-decrement-button',
    separator: 'h-datepicker-separator',
    minutePicker: 'h-datepicker-minute-picker',
    secondPicker: 'h-datepicker-second-picker',
    ampmPicker: 'h-datepicker-ampm-picker',
    buttonbar: 'h-datepicker-buttonbar',
    pcTodayButton: 'h-datepicker-today-button',
    pcClearButton: 'h-datepicker-clear-button',
    clearIcon: 'h-datepicker-clear-icon'
};

@Injectable()
export class DatePickerStyle extends BaseStyle {
    name = 'datepicker';

    style = style;

    classes = classes;

    inlineStyles = inlineStyles;
}

/**
 *
 * DatePicker is a form component to work with dates.
 *
 * [Live Demo](https://www.primeng.org/datepicker/)
 *
 * @module datepickerstyle
 *
 */
export enum DatePickerClasses {
    /**
     * Class name of the root element
     */
    root = 'h-datepicker',
    /**
     * Class name of the input element
     */
    pcInputText = 'h-datepicker-input',
    /**
     * Class name of the dropdown element
     */
    dropdown = 'h-datepicker-dropdown',
    /**
     * Class name of the input icon container element
     */
    inputIconContainer = 'h-datepicker-input-icon-container',
    /**
     * Class name of the input icon element
     */
    inputIcon = 'h-datepicker-input-icon',
    /**
     * Class name of the panel element
     */
    panel = 'h-datepicker-panel',
    /**
     * Class name of the calendar container element
     */
    calendarContainer = 'h-datepicker-calendar-container',
    /**
     * Class name of the calendar element
     */
    calendar = 'h-datepicker-calendar',
    /**
     * Class name of the header element
     */
    header = 'h-datepicker-header',
    /**
     * Class name of the previous button element
     */
    pcPrevButton = 'h-datepicker-prev-button',
    /**
     * Class name of the title element
     */
    title = 'h-datepicker-title',
    /**
     * Class name of the select month element
     */
    selectMonth = 'h-datepicker-select-month',
    /**
     * Class name of the select year element
     */
    selectYear = 'h-datepicker-select-year',
    /**
     * Class name of the decade element
     */
    decade = 'h-datepicker-decade',
    /**
     * Class name of the next button element
     */
    pcNextButton = 'h-datepicker-next-button',
    /**
     * Class name of the day view element
     */
    dayView = 'h-datepicker-day-view',
    /**
     * Class name of the week header element
     */
    weekHeader = 'h-datepicker-weekheader',
    /**
     * Class name of the week number element
     */
    weekNumber = 'h-datepicker-weeknumber',
    /**
     * Class name of the week label container element
     */
    weekLabelContainer = 'h-datepicker-weeklabel-container',
    /**
     * Class name of the week day cell element
     */
    weekDayCell = 'h-datepicker-weekday-cell',
    /**
     * Class name of the week day element
     */
    weekDay = 'h-datepicker-weekday',
    /**
     * Class name of the day cell element
     */
    dayCell = 'h-datepicker-day-cell',
    /**
     * Class name of the day element
     */
    day = 'h-datepicker-day',
    /**
     * Class name of the month view element
     */
    monthView = 'h-datepicker-month-view',
    /**
     * Class name of the month element
     */
    month = 'h-datepicker-month',
    /**
     * Class name of the year view element
     */
    yearView = 'h-datepicker-year-view',
    /**
     * Class name of the year element
     */
    year = 'h-datepicker-year',
    /**
     * Class name of the time picker element
     */
    timePicker = 'h-datepicker-time-picker',
    /**
     * Class name of the hour picker element
     */
    hourPicker = 'h-datepicker-hour-picker',
    /**
     * Class name of the increment button element
     */
    pcIncrementButton = 'h-datepicker-increment-button',
    /**
     * Class name of the decrement button element
     */
    pcDecrementButton = 'h-datepicker-decrement-button',
    /**
     * Class name of the separator element
     */
    separator = 'h-datepicker-separator',
    /**
     * Class name of the minute picker element
     */
    minutePicker = 'h-datepicker-minute-picker',
    /**
     * Class name of the second picker element
     */
    secondPicker = 'h-datepicker-second-picker',
    /**
     * Class name of the ampm picker element
     */
    ampmPicker = 'h-datepicker-ampm-picker',
    /**
     * Class name of the buttonbar element
     */
    buttonbar = 'h-datepicker-buttonbar',
    /**
     * Class name of the today button element
     */
    pcTodayButton = 'h-datepicker-today-button',
    /**
     * Class name of the clear button element
     */
    pcClearButton = 'h-datepicker-clear-button',
    /**
     * Class name of the clear icon
     */
    clearIcon = 'h-datepicker-clear-icon'
}

export interface DatePickerStyle extends BaseStyle {}
