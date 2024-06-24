export const basicProps = {
  title: { type: String, default: '选择人员' },
  helpMessage: { type: [Array, String], default: () => [] },
}
export const contactsProps = {
  checkedUser: { type: Array, default: () => [] },
  list: { type: Array, default: () => [] },

}
