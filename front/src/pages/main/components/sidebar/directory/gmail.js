import * as icons from "react-icons/md";
import * as iconsi from "react-icons/io5";
import * as iconsv from "react-icons/vsc";
import * as iconsb from "react-icons/bi";
import * as iconsim from "react-icons/im";
// import * as icons from "@mdi/react";

export const gmailData = [
    {
        id: "1",
        name: "Dockerfile",
        unread: 1,
        icon: iconsi.IoLogoDocker
    },
    {
        id: "2",
        name: "manage.py",
        unread: 0,
        icon: iconsi.IoLogoPython
    },
    {
        id: "3",
        name: "json.json",
        unread: 0,
        icon: iconsv.VscJson
    },
    {
        id: "4",
        name: "html.html",
        unread: 0,
        icon: iconsi.IoLogoHtml5
    },
    {
        id: "5",
        name: "css.css",
        unread: 0,
        icon: iconsi.IoLogoCss3
    },
    {
        id: "6",
        name: "markdown.md",
        unread: 54,
        icon: iconsi.IoLogoMarkdown
    },
    {
        id: "7",
        name: "db.sqlite3",
        unread: 0,
        icon: iconsv.VscDatabase
    },
    {
        id: "8",
        name: "poetry.lock",
        unread: 0,
        icon: iconsi.IoDocumentLockOutline
    },
    {
        id: "9",
        name: "pyproject.toml",
        unread: 0,
        icon: iconsb.BiBracket
    },
    {
        id: "10",
        name: "requirements.txt",
        unread: 0,
        icon: iconsi.IoDocumentTextOutline
    },
    {
        id: "11",
        name: ".gitignore",
        unread: 0,
        icon: iconsim.ImGit
    },
    {
        id: "12",
        name: "folderOpen",
        icon: iconsi.IoFolderOpenOutline,
        children: [
            {
                id: "13",
                name: "__init__.py",
                unread: 0,
                icon: iconsi.IoLogoPython
            },
            {
                id: "14",
                name: "asgi.py",
                unread: 0,
                icon: iconsi.IoLogoPython
            },
            {
                id: "15",
                name: "settings.py",
                unread: 0,
                icon: iconsi.IoLogoPython
            },
            {
                id: "16",
                name: "urls.py",
                unread: 0,
                icon: iconsi.IoLogoPython
            },
            {
                id: "17",
                name: "wsgi.py",
                unread: 0,
                icon: iconsi.IoLogoPython
            },
        ]
    },
];
