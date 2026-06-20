'use client';

import { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Folder,
  FileText,
  FileImage,
  File,
  Plus,
  FolderPlus,
  Upload,
  Trash2,
  Pencil,
  Grid3x3,
  List as ListIcon,
  Home,
  Search,
  Image as ImageIcon,
} from 'lucide-react';
import { useOS, uid } from '@/lib/os/store';
import type { WindowInstance, VFile } from '@/lib/os/types';

export function FileManager({ win }: { win: WindowInstance }) {
  const files = useOS((s) => s.files);
  const createFile = useOS((s) => s.createFile);
  const updateFile = useOS((s) => s.updateFile);
  const deleteFile = useOS((s) => s.deleteFile);
  const openApp = useOS((s) => s.openApp);
  const notify = useOS((s) => s.notify);

  const initialFolder = (win.state?.folderId as string) || null;
  const [currentId, setCurrentId] = useState<string | null>(initialFolder);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [query, setQuery] = useState('');
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameVal, setRenameVal] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const breadcrumb = useMemo(() => {
    const path: VFile[] = [];
    let id = currentId;
    while (id) {
      const f = files.find((x) => x.id === id);
      if (!f) break;
      path.unshift(f);
      id = f.parentId;
    }
    return path;
  }, [currentId, files]);

  const children = files.filter(
    (f) =>
      f.parentId === currentId &&
      f.name.toLowerCase().includes(query.toLowerCase()),
  );
  const folders = children.filter((f) => f.type === 'folder');
  const fileItems = children.filter((f) => f.type === 'file');
  const sorted = [...folders, ...fileItems];

  const openItem = (f: VFile) => {
    if (f.type === 'folder') {
      setCurrentId(f.id);
      setSelected(null);
      return;
    }
    // open file by type
    if (f.mimeType?.startsWith('image/')) {
      openApp('imageviewer', { fileId: f.id });
    } else if (f.mimeType === 'audio/' || f.dataUrl?.startsWith('data:audio')) {
      openApp('musicplayer');
    } else {
      openApp('texteditor', { fileId: f.id });
    }
  };

  const newFolder = () => {
    const name = `新建文件夹`;
    let finalName = name;
    let i = 1;
    while (files.some((f) => f.parentId === currentId && f.name === finalName)) {
      finalName = `${name} ${i++}`;
    }
    createFile({ name: finalName, type: 'folder', parentId: currentId });
    notify({ title: '已创建', body: finalName, icon: '📁' });
  };

  const newTextFile = () => {
    const name = `新建文本文档.txt`;
    let finalName = name;
    let i = 1;
    while (files.some((f) => f.parentId === currentId && f.name === finalName)) {
      finalName = `新建文本文档 ${i++}.txt`;
    }
    const id = createFile({ name: finalName, type: 'file', parentId: currentId, content: '', mimeType: 'text/plain' });
    openApp('texteditor', { fileId: id });
  };

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files || []);
    list.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        createFile({
          name: file.name,
          type: 'file',
          parentId: currentId,
          mimeType: file.type,
          dataUrl: reader.result as string,
          content: file.type.startsWith('text/') ? reader.result as string : undefined,
        });
      };
      if (file.type.startsWith('text/')) reader.readAsText(file);
      else reader.readAsDataURL(file);
    });
    if (list.length) notify({ title: '上传完成', body: `${list.length} 个文件`, icon: '📤' });
    e.target.value = '';
  };

  const startRename = (f: VFile) => {
    setRenaming(f.id);
    setRenameVal(f.name);
  };
  const commitRename = () => {
    if (renaming && renameVal.trim()) {
      updateFile(renaming, { name: renameVal.trim() });
    }
    setRenaming(null);
  };

  const remove = (f: VFile) => {
    deleteFile(f.id);
    setSelected(null);
    notify({ title: '已删除', body: f.name, icon: '🗑️' });
  };

  const iconFor = (f: VFile) => {
    if (f.type === 'folder') return <Folder className="w-5 h-5 text-amber-500" />;
    if (f.mimeType?.startsWith('image/')) return <FileImage className="w-5 h-5 text-emerald-500" />;
    if (f.mimeType?.startsWith('text/') || f.name.endsWith('.txt')) return <FileText className="w-5 h-5 text-sky-500" />;
    return <File className="w-5 h-5 text-muted-foreground" />;
  };

  const bigIconFor = (f: VFile) => {
    if (f.type === 'folder') return <span className="text-4xl">📁</span>;
    if (f.mimeType?.startsWith('image/')) return <span className="text-4xl">🖼️</span>;
    if (f.mimeType?.startsWith('text/') || f.name.endsWith('.txt')) return <span className="text-4xl">📄</span>;
    return <span className="text-4xl">📦</span>;
  };

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar */}
      <div className="w-16 sm:w-44 shrink-0 border-r border-border bg-muted/30 p-2 flex flex-col gap-1">
        <SideItem
          icon={<Home className="w-4 h-4" />}
          label="主页"
          active={currentId === null}
          onClick={() => setCurrentId(null)}
        />
        {files
          .filter((f) => f.type === 'folder' && f.parentId === null)
          .map((f) => (
            <SideItem
              key={f.id}
              icon={<Folder className="w-4 h-4 text-amber-500" />}
              label={f.name}
              active={breadcrumb.some((b) => b.id === f.id)}
              onClick={() => setCurrentId(f.id)}
            />
          ))}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-2 h-11 border-b border-border bg-background shrink-0">
          <button
            onClick={() => {
              const parent = currentId ? files.find((f) => f.id === currentId)?.parentId ?? null : null;
              setCurrentId(parent);
            }}
            disabled={!currentId}
            className="w-8 h-8 rounded-lg hover:bg-accent disabled:opacity-30 flex items-center justify-center"
            title="后退"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button disabled className="w-8 h-8 rounded-lg opacity-30 flex items-center justify-center">
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1 flex-1 min-w-0 px-2">
            <button
              onClick={() => setCurrentId(null)}
              className="text-sm hover:underline shrink-0"
            >
              主页
            </button>
            {breadcrumb.map((b) => (
              <div key={b.id} className="flex items-center gap-1 min-w-0">
                <ChevronRight className="w-3 h-3 text-muted-foreground shrink-0" />
                <button
                  onClick={() => setCurrentId(b.id)}
                  className="text-sm hover:underline truncate"
                >
                  {b.name}
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <div className="hidden sm:flex items-center gap-1 h-8 px-2 rounded-lg bg-muted">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索"
                className="w-24 bg-transparent outline-none text-sm"
              />
            </div>
            <button onClick={newFolder} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center" title="新建文件夹">
              <FolderPlus className="w-4 h-4" />
            </button>
            <button onClick={newTextFile} className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center" title="新建文本文档">
              <FileText className="w-4 h-4" />
            </button>
            <label className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center cursor-pointer" title="上传">
              <Upload className="w-4 h-4" />
              <input type="file" multiple className="hidden" onChange={onUpload} />
            </label>
            <div className="w-px h-5 bg-border mx-1" />
            <button
              onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
              className="w-8 h-8 rounded-lg hover:bg-accent flex items-center justify-center"
              title="切换视图"
            >
              {view === 'grid' ? <ListIcon className="w-4 h-4" /> : <Grid3x3 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          className="flex-1 overflow-y-auto p-3"
          onClick={() => setSelected(null)}
          onContextMenu={(e) => e.preventDefault()}
        >
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <Folder className="w-12 h-12 mb-2 opacity-30" />
              <p className="text-sm">此文件夹为空</p>
              <p className="text-xs mt-1">使用工具栏新建文件夹或上传文件</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(96px,1fr))] gap-2">
              {sorted.map((f) => (
                <div
                  key={f.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(f.id);
                  }}
                  onDoubleClick={() => openItem(f)}
                  className={`group relative flex flex-col items-center gap-1.5 p-3 rounded-xl cursor-default transition ${
                    selected === f.id ? 'bg-primary/10 ring-1 ring-primary/40' : 'hover:bg-accent/50'
                  }`}
                >
                  {bigIconFor(f)}
                  {renaming === f.id ? (
                    <input
                      autoFocus
                      value={renameVal}
                      onChange={(e) => setRenameVal(e.target.value)}
                      onBlur={commitRename}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitRename();
                        if (e.key === 'Escape') setRenaming(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full text-xs text-center px-1 rounded border border-primary outline-none"
                    />
                  ) : (
                    <span className="text-xs text-center line-clamp-2 break-all w-full">
                      {f.name}
                    </span>
                  )}
                  <div className="absolute top-1 right-1 hidden group-hover:flex items-center gap-0.5 bg-background/90 rounded-md shadow border border-border">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startRename(f);
                      }}
                      className="w-6 h-6 rounded hover:bg-accent flex items-center justify-center"
                      title="重命名"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(f);
                      }}
                      className="w-6 h-6 rounded hover:bg-destructive/10 text-destructive flex items-center justify-center"
                      title="删除"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border">
                  <th className="py-2 px-2 font-medium">名称</th>
                  <th className="py-2 px-2 font-medium w-32 hidden sm:table-cell">修改时间</th>
                  <th className="py-2 px-2 font-medium w-20">操作</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((f) => (
                  <tr
                    key={f.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(f.id);
                    }}
                    onDoubleClick={() => openItem(f)}
                    className={`border-b border-border/50 cursor-default transition ${
                      selected === f.id ? 'bg-primary/10' : 'hover:bg-accent/50'
                    }`}
                  >
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        {iconFor(f)}
                        {renaming === f.id ? (
                          <input
                            autoFocus
                            value={renameVal}
                            onChange={(e) => setRenameVal(e.target.value)}
                            onBlur={commitRename}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') commitRename();
                              if (e.key === 'Escape') setRenaming(null);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 text-sm px-1 rounded border border-primary outline-none"
                          />
                        ) : (
                          <span className="truncate">{f.name}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-2 text-xs text-muted-foreground hidden sm:table-cell">
                      {new Date(f.updatedAt).toLocaleString('zh-CN', {
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startRename(f);
                          }}
                          className="w-6 h-6 rounded hover:bg-accent flex items-center justify-center"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(f);
                          }}
                          className="w-6 h-6 rounded hover:bg-destructive/10 text-destructive flex items-center justify-center"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between px-3 h-7 border-t border-border bg-muted/30 text-xs text-muted-foreground shrink-0">
          <span>{sorted.length} 项</span>
          {selected && (
            <span>
              已选择: {files.find((f) => f.id === selected)?.name}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function SideItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition w-full text-left ${
        active ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
      }`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="truncate hidden sm:inline">{label}</span>
    </button>
  );
}
