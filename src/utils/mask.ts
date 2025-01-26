// 身份证号码脱敏
export const maskIDCard = (idCard: string): string => {
    if (!idCard) return ''
    return idCard.replace(/^(.{6})(.+)(.{4})$/, '$1********$3')
}

// 姓名脱敏
export const maskName = (name: string): string => {
    if (!name) return ''
    return name.replace(/^(.)(.+)$/, '$1*'.repeat(name.length - 1))
}

// 通用脱敏处理
export const maskSensitiveInfo = (value: string, type: 'idCard'): string => {
    switch (type) {
        case 'idCard':
            return maskIDCard(value)
        default:
            return value
    }
} 