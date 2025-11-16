import { format } from 'date-fns'
import { pt } from 'date-fns/locale'

const dateMonthDay = (dateString: string, locale = 'en') => {
    const date = new Date(dateString)
    return format(date, locale === 'pt' ? 'd MMMM' : 'MMMM d', {
        locale: locale === 'pt' ? pt : undefined,
    })
}

const dateFull = (dateString: string, locale = 'en') => {
    const date = new Date(dateString)
    return format(date, locale === 'pt' ? 'd MMMM yyyy' : 'MMMM d yyyy', {
        locale: locale === 'pt' ? pt : undefined,
    })
}

const dateAbbreviate = (dateString: string, year = false, locale = 'en') => {
    const date = new Date(dateString)
    return format(
        date,
        locale === 'pt'
            ? `d MMM${year ? ' yyyy' : ''}`
            : `MMM d${year ? ' yyyy' : ''}`,
        {
            locale: locale === 'pt' ? pt : undefined,
        }
    )
}

const dateWithHour = (dateString: string, locale = 'en') => {
    const date = new Date(dateString)
    return format(date, locale === 'pt' ? 'd MMMM, HH:mm' : 'MMMM d, HH:mm', {
        locale: locale === 'pt' ? pt : undefined,
    })
}

export { dateMonthDay, dateFull, dateAbbreviate, dateWithHour }
