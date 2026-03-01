import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Coffee, Zap, Sparkles, BookOpen, CalendarDays, ClipboardList, Star, LogIn, UserPlus, Bell, GraduationCap, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Icon from "@/components/ui/icon"
import { useNavigate } from "react-router-dom"

type Theme = "day" | "night" | "coffee" | "mint" | "electric"
type Page = "home" | "schedule" | "grades" | "homework" | "login" | "register"

const themes: Record<Theme, {
  name: string
  icon: typeof Sun
  bg: string
  cardBg: string
  text: string
  textSecondary: string
  border: string
  accent: string
  buttonBg: string
  buttonText: string
  buttonHover: string
}> = {
  day: {
    name: "День",
    icon: Sun,
    bg: "bg-gray-50",
    cardBg: "bg-white",
    text: "text-gray-900",
    textSecondary: "text-gray-500",
    border: "border-gray-200",
    accent: "text-gray-900",
    buttonBg: "bg-gray-900",
    buttonText: "text-white",
    buttonHover: "hover:bg-gray-700",
  },
  night: {
    name: "Ночь",
    icon: Moon,
    bg: "bg-gray-900",
    cardBg: "bg-gray-800",
    text: "text-gray-100",
    textSecondary: "text-gray-400",
    border: "border-gray-700",
    accent: "text-gray-100",
    buttonBg: "bg-gray-100",
    buttonText: "text-gray-900",
    buttonHover: "hover:bg-gray-300",
  },
  coffee: {
    name: "Кофе",
    icon: Coffee,
    bg: "bg-amber-50",
    cardBg: "bg-amber-100",
    text: "text-amber-900",
    textSecondary: "text-amber-700",
    border: "border-amber-200",
    accent: "text-amber-800",
    buttonBg: "bg-amber-800",
    buttonText: "text-amber-50",
    buttonHover: "hover:bg-amber-700",
  },
  mint: {
    name: "Мята",
    icon: Sparkles,
    bg: "bg-emerald-50",
    cardBg: "bg-emerald-100",
    text: "text-emerald-900",
    textSecondary: "text-emerald-700",
    border: "border-emerald-200",
    accent: "text-emerald-800",
    buttonBg: "bg-emerald-800",
    buttonText: "text-emerald-50",
    buttonHover: "hover:bg-emerald-700",
  },
  electric: {
    name: "Электро",
    icon: Zap,
    bg: "bg-slate-900",
    cardBg: "bg-slate-800",
    text: "text-cyan-100",
    textSecondary: "text-cyan-300",
    border: "border-cyan-500",
    accent: "text-cyan-400",
    buttonBg: "bg-cyan-500",
    buttonText: "text-slate-900",
    buttonHover: "hover:bg-cyan-400",
  },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
}

const cardVariants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: "spring", stiffness: 150, damping: 15 },
  },
  hover: {
    scale: 1.03,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  tap: { scale: 0.97 },
}

// Мок-данные
const scheduleToday = [
  { time: "08:00", subject: "Математический анализ", room: "А-201", teacher: "Иванов А.П." },
  { time: "09:45", subject: "Программирование", room: "Б-310", teacher: "Петрова М.С." },
  { time: "11:30", subject: "История", room: "В-105", teacher: "Сидоров Д.Н." },
  { time: "13:15", subject: "Английский язык", room: "Г-204", teacher: "Смирнова О.В." },
]

const recentGrades = [
  { subject: "Математика", grade: 5, date: "27.02", type: "Контрольная" },
  { subject: "Программирование", grade: 4, date: "26.02", type: "Лабораторная" },
  { subject: "История", grade: 5, date: "25.02", type: "Устный ответ" },
  { subject: "Английский", grade: 3, date: "24.02", type: "Тест" },
]

const homework = [
  { subject: "Математика", task: "Задачи §12, №1-15", deadline: "02.03", done: false },
  { subject: "Программирование", task: "Лабораторная работа №4", deadline: "03.03", done: true },
  { subject: "История", task: "Реферат: Первая мировая война", deadline: "05.03", done: false },
  { subject: "Английский", task: "Unit 7, упражнения A-D", deadline: "02.03", done: true },
]

const gradeColor = (g: number) => {
  if (g === 5) return "text-green-600"
  if (g === 4) return "text-blue-600"
  if (g === 3) return "text-yellow-600"
  return "text-red-600"
}

export default function StudentCabinet() {
  const [currentTheme, setCurrentTheme] = useState<Theme>("day")
  const [currentPage, setCurrentPage] = useState<Page>("home")
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", group: "" })
  const theme = themes[currentTheme]

  const navItems: { id: Page; label: string; icon: string }[] = [
    { id: "home", label: "Главная", icon: "GraduationCap" },
    { id: "schedule", label: "Расписание", icon: "CalendarDays" },
    { id: "grades", label: "Оценки", icon: "Star" },
    { id: "homework", label: "Задания", icon: "ClipboardList" },
  ]

  return (
    <div className={`min-h-screen transition-all duration-500 ${theme.bg}`}>
      {/* Theme Switcher */}
      <motion.div
        className="fixed top-4 right-4 z-20"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className={`flex gap-1 p-1.5 rounded-full ${theme.cardBg} ${theme.border} border-2 shadow-md`}>
          {Object.entries(themes).map(([key, themeData]) => {
            const IconComponent = themeData.icon
            return (
              <motion.button
                key={key}
                onClick={() => setCurrentTheme(key as Theme)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  currentTheme === key
                    ? `${theme.buttonBg} ${theme.buttonText}`
                    : theme.text
                }`}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                title={themeData.name}
              >
                <IconComponent size={15} />
              </motion.button>
            )
          })}
        </div>
      </motion.div>

      {/* Nav */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-10 ${theme.cardBg} ${theme.border} border-b shadow-sm`}
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
      >
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between h-14">
          <motion.button
            onClick={() => setCurrentPage("home")}
            className={`flex items-center gap-2 font-bold text-lg ${theme.text}`}
            whileHover={{ scale: 1.04 }}
          >
            <Icon name="GraduationCap" size={22} />
            СтудКабинет
          </motion.button>
          <div className="flex gap-1">
            <motion.button
              onClick={() => setCurrentPage("login")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${theme.text} ${theme.border} border`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Войти
            </motion.button>
            <motion.button
              onClick={() => setCurrentPage("register")}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium ${theme.buttonBg} ${theme.buttonText}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Регистрация
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Main */}
      <div className="pt-14 pb-24 max-w-2xl mx-auto px-4">
        <AnimatePresence mode="wait">

          {/* HOME */}
          {currentPage === "home" && (
            <motion.div
              key="home"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Profile card */}
              <motion.div
                className={`mt-8 p-6 rounded-2xl ${theme.cardBg} ${theme.border} border-2 text-center mb-6`}
                variants={itemVariants}
              >
                <motion.div
                  className={`w-20 h-20 mx-auto mb-4 rounded-full ${theme.buttonBg} flex items-center justify-center`}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Icon name="GraduationCap" size={36} className={theme.buttonText} />
                </motion.div>
                <h1 className={`text-2xl font-bold ${theme.text}`}>Алексей Иванов</h1>
                <p className={`${theme.textSecondary} mt-1`}>Группа: ИС-21 · 2 курс · Бакалавриат</p>
                <div className={`mt-4 flex justify-center gap-6 pt-4 border-t ${theme.border}`}>
                  <div>
                    <p className={`text-2xl font-bold ${theme.text}`}>4.7</p>
                    <p className={`text-xs ${theme.textSecondary}`}>Средний балл</p>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${theme.text}`}>12</p>
                    <p className={`text-xs ${theme.textSecondary}`}>Предметов</p>
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${theme.text}`}>3</p>
                    <p className={`text-xs ${theme.textSecondary}`}>Задания</p>
                  </div>
                </div>
              </motion.div>

              {/* Quick nav */}
              <motion.div className="grid grid-cols-3 gap-3 mb-6" variants={containerVariants}>
                {[
                  { id: "schedule" as Page, label: "Расписание", icon: "CalendarDays", desc: "Сегодня 4 пары" },
                  { id: "grades" as Page, label: "Оценки", icon: "Star", desc: "Последняя: 5" },
                  { id: "homework" as Page, label: "Задания", icon: "ClipboardList", desc: "2 не сдано" },
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id)}
                    className={`p-4 rounded-xl ${theme.cardBg} ${theme.border} border-2 text-left`}
                    variants={cardVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Icon name={item.icon} size={24} className={theme.accent} />
                    <p className={`font-semibold mt-2 text-sm ${theme.text}`}>{item.label}</p>
                    <p className={`text-xs mt-0.5 ${theme.textSecondary}`}>{item.desc}</p>
                  </motion.button>
                ))}
              </motion.div>

              {/* Today schedule preview */}
              <motion.div
                className={`p-5 rounded-2xl ${theme.cardBg} ${theme.border} border-2`}
                variants={itemVariants}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`font-bold text-lg ${theme.text}`}>Расписание на сегодня</h2>
                  <motion.button
                    onClick={() => setCurrentPage("schedule")}
                    className={`text-sm ${theme.textSecondary}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    Все →
                  </motion.button>
                </div>
                <div className="space-y-3">
                  {scheduleToday.slice(0, 3).map((lesson, i) => (
                    <motion.div
                      key={i}
                      className={`flex items-center gap-3 p-3 rounded-lg ${theme.bg}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <div className={`text-xs font-mono font-bold ${theme.accent} w-12`}>{lesson.time}</div>
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${theme.text}`}>{lesson.subject}</p>
                        <p className={`text-xs ${theme.textSecondary}`}>{lesson.room} · {lesson.teacher}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* SCHEDULE */}
          {currentPage === "schedule" && (
            <motion.div
              key="schedule"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div className="mt-8 mb-6" variants={itemVariants}>
                <h2 className={`text-2xl font-bold ${theme.text}`}>Расписание</h2>
                <p className={`${theme.textSecondary} mt-1`}>1 марта 2026, воскресенье</p>
              </motion.div>
              {/* Days tabs */}
              <motion.div className={`flex gap-2 mb-5 overflow-x-auto`} variants={itemVariants}>
                {["Пн", "Вт", "Ср", "Чт", "Пт"].map((day, i) => (
                  <motion.button
                    key={day}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                      i === 0 ? `${theme.buttonBg} ${theme.buttonText}` : `${theme.cardBg} ${theme.border} border ${theme.text}`
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {day}
                  </motion.button>
                ))}
              </motion.div>
              <motion.div className="space-y-3" variants={containerVariants}>
                {scheduleToday.map((lesson, i) => (
                  <motion.div
                    key={i}
                    className={`p-4 rounded-xl ${theme.cardBg} ${theme.border} border-2`}
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-2 rounded-lg ${theme.buttonBg} ${theme.buttonText} text-sm font-mono font-bold`}>
                          {lesson.time}
                        </div>
                        <div>
                          <p className={`font-semibold ${theme.text}`}>{lesson.subject}</p>
                          <p className={`text-sm ${theme.textSecondary}`}>{lesson.teacher}</p>
                        </div>
                      </div>
                      <div className={`text-right text-sm ${theme.textSecondary}`}>
                        <p className="font-medium">{lesson.room}</p>
                        <p>90 мин</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* GRADES */}
          {currentPage === "grades" && (
            <motion.div
              key="grades"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div className="mt-8 mb-6" variants={itemVariants}>
                <h2 className={`text-2xl font-bold ${theme.text}`}>Мои оценки</h2>
                <p className={`${theme.textSecondary} mt-1`}>Весенний семестр 2026</p>
              </motion.div>
              {/* GPA */}
              <motion.div
                className={`p-5 rounded-2xl ${theme.cardBg} ${theme.border} border-2 mb-5 text-center`}
                variants={itemVariants}
              >
                <p className={`text-5xl font-bold ${theme.text}`}>4.7</p>
                <p className={`${theme.textSecondary} mt-1`}>Средний балл (GPA)</p>
                <div className={`flex justify-center gap-6 mt-4 pt-4 border-t ${theme.border}`}>
                  {[{ label: "Отлично", count: 8, color: "text-green-600" }, { label: "Хорошо", count: 3, color: "text-blue-600" }, { label: "Удовл.", count: 1, color: "text-yellow-600" }].map(s => (
                    <div key={s.label}>
                      <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
                      <p className={`text-xs ${theme.textSecondary}`}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div className="space-y-3" variants={containerVariants}>
                {recentGrades.map((g, i) => (
                  <motion.div
                    key={i}
                    className={`p-4 rounded-xl ${theme.cardBg} ${theme.border} border-2 flex items-center justify-between`}
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div>
                      <p className={`font-semibold ${theme.text}`}>{g.subject}</p>
                      <p className={`text-sm ${theme.textSecondary}`}>{g.type} · {g.date}</p>
                    </div>
                    <div className={`text-3xl font-bold ${gradeColor(g.grade)}`}>{g.grade}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* HOMEWORK */}
          {currentPage === "homework" && (
            <motion.div
              key="homework"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
            >
              <motion.div className="mt-8 mb-6" variants={itemVariants}>
                <h2 className={`text-2xl font-bold ${theme.text}`}>Домашние задания</h2>
                <p className={`${theme.textSecondary} mt-1`}>2 задания не выполнено</p>
              </motion.div>
              <motion.div className="space-y-3" variants={containerVariants}>
                {homework.map((hw, i) => (
                  <motion.div
                    key={i}
                    className={`p-4 rounded-xl ${theme.cardBg} ${theme.border} border-2`}
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${hw.done ? "text-green-500" : "text-red-400"}`}>
                        <Icon name={hw.done ? "CheckCircle" : "AlertCircle"} size={20} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className={`font-semibold ${theme.text}`}>{hw.subject}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${hw.done ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {hw.done ? "Сдано" : "До " + hw.deadline}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${theme.textSecondary}`}>{hw.task}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* LOGIN */}
          {currentPage === "login" && (
            <motion.div
              key="login"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="max-w-sm mx-auto"
            >
              <motion.div
                className={`mt-12 p-6 rounded-2xl ${theme.cardBg} ${theme.border} border-2`}
                variants={itemVariants}
              >
                <div className="text-center mb-6">
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full ${theme.buttonBg} flex items-center justify-center`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Icon name="LogIn" size={28} className={theme.buttonText} />
                  </motion.div>
                  <h2 className={`text-2xl font-bold ${theme.text}`}>Вход в кабинет</h2>
                  <p className={`text-sm mt-1 ${theme.textSecondary}`}>Введите свои данные для входа</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme.text}`}>Email</label>
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="student@university.ru"
                      className={`w-full px-4 py-2.5 rounded-lg ${theme.bg} ${theme.border} border-2 ${theme.text} placeholder:${theme.textSecondary} outline-none focus:ring-2`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${theme.text}`}>Пароль</label>
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="••••••••"
                      className={`w-full px-4 py-2.5 rounded-lg ${theme.bg} ${theme.border} border-2 ${theme.text} outline-none focus:ring-2`}
                    />
                  </div>
                  <motion.button
                    className={`w-full py-3 rounded-lg font-semibold ${theme.buttonBg} ${theme.buttonText} mt-2`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentPage("home")}
                  >
                    Войти
                  </motion.button>
                </div>
                <p className={`text-center text-sm mt-4 ${theme.textSecondary}`}>
                  Нет аккаунта?{" "}
                  <button
                    onClick={() => setCurrentPage("register")}
                    className={`font-semibold ${theme.accent} underline`}
                  >
                    Зарегистрироваться
                  </button>
                </p>
              </motion.div>
            </motion.div>
          )}

          {/* REGISTER */}
          {currentPage === "register" && (
            <motion.div
              key="register"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -20 }}
              className="max-w-sm mx-auto"
            >
              <motion.div
                className={`mt-8 p-6 rounded-2xl ${theme.cardBg} ${theme.border} border-2`}
                variants={itemVariants}
              >
                <div className="text-center mb-6">
                  <motion.div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full ${theme.buttonBg} flex items-center justify-center`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <Icon name="UserPlus" size={28} className={theme.buttonText} />
                  </motion.div>
                  <h2 className={`text-2xl font-bold ${theme.text}`}>Регистрация</h2>
                  <p className={`text-sm mt-1 ${theme.textSecondary}`}>Создайте аккаунт студента</p>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "ФИО", key: "name", type: "text", placeholder: "Иванов Алексей Сергеевич" },
                    { label: "Email", key: "email", type: "email", placeholder: "student@university.ru" },
                    { label: "Номер группы", key: "group", type: "text", placeholder: "ИС-21" },
                    { label: "Пароль", key: "password", type: "password", placeholder: "••••••••" },
                  ].map(field => (
                    <div key={field.key}>
                      <label className={`block text-sm font-medium mb-1 ${theme.text}`}>{field.label}</label>
                      <input
                        type={field.type}
                        value={registerForm[field.key as keyof typeof registerForm]}
                        onChange={e => setRegisterForm({ ...registerForm, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className={`w-full px-4 py-2.5 rounded-lg ${theme.bg} ${theme.border} border-2 ${theme.text} outline-none focus:ring-2`}
                      />
                    </div>
                  ))}
                  <motion.button
                    className={`w-full py-3 rounded-lg font-semibold ${theme.buttonBg} ${theme.buttonText} mt-2`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentPage("login")}
                  >
                    Создать аккаунт
                  </motion.button>
                </div>
                <p className={`text-center text-sm mt-4 ${theme.textSecondary}`}>
                  Уже есть аккаунт?{" "}
                  <button
                    onClick={() => setCurrentPage("login")}
                    className={`font-semibold ${theme.accent} underline`}
                  >
                    Войти
                  </button>
                </p>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Bottom Nav */}
      <motion.div
        className={`fixed bottom-0 left-0 right-0 ${theme.cardBg} ${theme.border} border-t z-10`}
        initial={{ y: 80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 18, delay: 0.2 }}
      >
        <div className="max-w-2xl mx-auto flex justify-around py-2">
          {navItems.map(item => (
            <motion.button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-all ${
                currentPage === item.id
                  ? `${theme.buttonBg} ${theme.buttonText}`
                  : theme.textSecondary
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon name={item.icon} size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
