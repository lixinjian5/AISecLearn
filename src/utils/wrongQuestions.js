const KEY = 'aiseclearn_wrong_questions'

export function getWrongQuestions() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch { return [] }
}

export function addWrongQuestion(q, userAnswer) {
  const list = getWrongQuestions()
  // 去重
  const exists = list.find(item => item.id === q.id)
  if (!exists) {
    list.unshift({ ...q, userAnswer, time: new Date().toLocaleDateString('zh-CN') })
  }
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function removeWrongQuestion(id) {
  const list = getWrongQuestions().filter(item => item.id !== id)
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function clearWrongQuestions() {
  localStorage.removeItem(KEY)
}
