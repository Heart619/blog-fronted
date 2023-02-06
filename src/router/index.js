import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由懒加载
const Welcome = () => import(/* webpackChunkName: "Welcome" */ '../views/Welcome')
const Index = () => import(/* webpackChunkName: "Welcome" */ '../components/Index')
const About = () => import(/* webpackChunkName: "Welcome" */ '../components/About')
const Project = () => import(/* webpackChunkName: "Welcome" */ '../components/Project')
const Message = () => import(/* webpackChunkName: "Welcome" */ '../components/Message')
const Essay = () => import(/* webpackChunkName: "Welcome" */ '../components/Essay')

const Blog = () => import(/* webpackChunkName: "Blog" */ '../components/Blog')

const Home = () => import(/* webpackChunkName: "Home" */ '../views/Home')
const AdminIndex = () => import(/* webpackChunkName: "Home" */ '../components/admin/AdminIndex')

const Blogs = () => import(/* webpackChunkName: "Blog_Home" */ '../components/admin/Blogs')
const Blog_input = () => import(/* webpackChunkName: "Blog_Home" */ '../components/admin/Blog_input')

const Tags = () => import(/* webpackChunkName: "Tags" */ '../components/admin/Tags')
const Types = () => import(/* webpackChunkName: "Types" */ '../components/admin/Types')

const Essays = () => import(/* webpackChunkName: "Essay" */ '../components/admin/Essays')

const Projects = () => import(/* webpackChunkName: "Projects" */ '../components/admin/Projects')

const Comments = () => import(/* webpackChunkName: "Comment" */ '../components/admin/Comments')

const Administrator = () => import(/* webpackChunkName: "Admin" */ '../components/admin/Administrator')
const Users = () => import(/* webpackChunkName: "User" */ '../components/admin/Users')

const Error = () => import(/* webpackChunkName: "Error" */ '../components/Error')
const Pictures = () => import(/* webpackChunkName: "Pictures" */ '../components/admin/Pictures')
const PrePictures = () => import(/* webpackChunkName: "PrePictures" */ '../components/Pictures')



Vue.use(VueRouter)

const routes = [
    {
        path: '/error',
        component: Error
    },
    {
        path: '/',
        component: Welcome,
        redirect: '/index',
        children: [
            {path: '/index', component: Index},
            {path: '/about', component: About},
            {path: '/blogInfo', component: Blog},
            {path: '/project', component: Project},
            {path: '/message', component: Message},
            {path: '/pictures', component: PrePictures},
            {path: '/essay', component: Essay},
        ]
    },
    {
        path: '/admin',
        component: Home,
        // 挂载路由导航守卫
        beforeEnter: (to, from, next) => {
            // to 将要访问的路径
            // from 代表从哪个路径跳转而来
            // next 是一个函数，表示放行
            // next() 放行  next('login') 强制跳转
            const userInfo = JSON.parse(window.localStorage.getItem('user'))
            if (!userInfo) return next('/error')
            else {
                if (userInfo.type === 0) return next('/error')
                next()
            }
            next()
        },
        redirect: '/admin/index',
        children: [
            {path: '/admin/index', component: AdminIndex, name: false},
            {path: '/admin/blogs', component: Blogs, name: true},
            {path: '/admin/blog-input', component: Blog_input, name: true},
            {path: '/admin/administrator', component: Administrator, name: true},
            {path: '/admin/types', component: Types, name: false},
            {path: '/admin/tags', component: Tags, name: false},
            {path: '/admin/comments', component: Comments, name: false},
            {path: '/admin/essays', component: Essays, name: true},
            {path: '/admin/projects', component: Projects, name: false},
            {path: '/admin/users', component: Users, name: false},
            {path: '/admin/pictures', component: Pictures, name: true}
        ]
    }
]

const router = new VueRouter({
    mode: 'hash',
    routes
})

export default router
