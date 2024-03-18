import { Tree } from './permute.js'
import { dictionary } from './dictionary.js'

const get_word = (word) => {
    let last_three_words = word.trim().split(' ')
    return slugify(last_three_words.slice(-3), '_')
}

function slugify(text, separator) {
    text = text.toString().toLowerCase().trim()

    const sets = [
        { to: 'a', from: '[ÀÁÂÃÅÆĀĂĄẠẢẤẦẨẪẬẮẰẲẴẶ]' },
        { to: 'ae', from: '[ÄÆ]' },
        { to: 'c', from: '[ÇĆĈČ]' },
        { to: 'd', from: '[ÐĎĐÞ]' },
        { to: 'e', from: '[ÈÉÊËĒĔĖĘĚẸẺẼẾỀỂỄỆ]' },
        { to: 'g', from: '[ĜĞĢǴ]' },
        { to: 'h', from: '[ĤḦ]' },
        { to: 'i', from: '[ÌÍÎÏĨĪĮİỈỊ]' },
        { to: 'j', from: '[Ĵ]' },
        { to: 'ij', from: '[Ĳ]' },
        { to: 'k', from: '[Ķ]' },
        { to: 'l', from: '[ĹĻĽŁ]' },
        { to: 'm', from: '[Ḿ]' },
        { to: 'n', from: '[ÑŃŅŇ]' },
        { to: 'o', from: '[ÒÓÔÕØŌŎŐỌỎỐỒỔỖỘỚỜỞỠỢǪǬƠ]' },
        { to: 'oe', from: '[ŒÖØ]' },
        { to: 'p', from: '[ṕ]' },
        { to: 'r', from: '[ŔŖŘ]' },
        { to: 's', from: '[ŚŜŞŠ]' },
        { to: 'ss', from: '[ß]' },
        { to: 't', from: '[ŢŤ]' },
        { to: 'u', from: '[ÙÚÛŨŪŬŮŰŲỤỦỨỪỬỮỰƯ]' },
        { to: 'ue', from: '[Ü]' },
        { to: 'w', from: '[ẂŴẀẄ]' },
        { to: 'x', from: '[ẍ]' },
        { to: 'y', from: '[ÝŶŸỲỴỶỸ]' },
        { to: 'z', from: '[ŹŻŽ]' },
        { to: '-', from: "[·/_,:;']" }
    ]

    sets.forEach(set => {
        text = text.replace(new RegExp(set.from, 'gi'), set.to)
    })

    text = text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/&/g, '-and-') // Replace & with 'and'
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\--+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, '') // Trim - from end of text

    if (typeof separator !== 'undefined' && separator !== '-') {
        text = text.replace(/-/g, separator)
    }

    return text
}

const get_suggestion = (word) => {
    let new_tree = dictionary[word]
    if (!new_tree) {
        return ''
    }
    let permute = new Tree({ main: new_tree })
    return permute.one
}

const find_a_suggestion = (word_parts) => {
    let suggested_word

    word_parts = cut_after_punctuation(word_parts, '.')
    word_parts = cut_after_punctuation(word_parts, ',')

    let word = get_word(word_parts.join(' '))
    suggested_word = get_suggestion(word)
    if (suggested_word !== '') {
        return suggested_word
    }
    word_parts.shift()
    if (!word_parts.length) return false
    return find_a_suggestion(word_parts)
}

const cut_after_punctuation = (word_parts, delimiter) => {
    let split_up = word_parts.join(' ').split(delimiter).pop().trim()
    return split_up.split(' ').filter(word => word)
}

export const getSuggestion = async (entryValue) => {
    let word = get_word(entryValue)
    if (word === '') return ''

    let suggested_word = find_a_suggestion(entryValue.trim().split(' ').slice(-3))

    if (!suggested_word) {
        return ''
    }
    return suggested_word
}

