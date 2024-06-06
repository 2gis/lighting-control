export function formatToMinutes(date: Date): number {
    return date.getHours() * 60 + date.getMinutes();
}

const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric'
});

export function formatHHMM(date: Date) {
    return formatter.format(date);
}

export function formatToDatepicker(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function parseDatepickerFormat(value: string | undefined): Date {
    const date = new Date();

    if (!value) {
        return date;
    }

    const result = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

    if (result) {
        date.setFullYear(parseInt(result[1]!));
        date.setMonth(parseInt(result[2]!) - 1);
        date.setDate(parseInt(result[3]!));
    }

    return date;
}
