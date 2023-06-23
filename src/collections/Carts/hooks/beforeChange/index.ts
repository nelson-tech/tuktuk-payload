import updateCountHook from './updateCount'
import updateLastEdit from './updateLastEdit'
import updateTotal from './updateTotal'

const beforeChange = [updateCountHook, updateLastEdit, updateTotal]

export default beforeChange
