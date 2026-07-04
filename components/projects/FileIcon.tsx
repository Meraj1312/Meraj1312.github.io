import { Icon } from "@iconify/react";
import { Folder } from "lucide-react";

interface Props {
  name: string;
  type: "file" | "dir";
}

export default function FileIcon({
  name,
  type,
}: Props) {
  if (type === "dir") {
    return (
      <Folder className="h-5 w-5 shrink-0 text-yellow-400" />
    );
  }

  const lower = name.toLowerCase();

  if (lower.endsWith(".md"))
    return <Icon icon="vscode-icons:file-type-markdown" className="h-5 w-5" />;

  if (lower.endsWith(".py"))
    return <Icon icon="vscode-icons:file-type-python" className="h-5 w-5" />;

  if (lower.endsWith(".js"))
    return <Icon icon="vscode-icons:file-type-js-official" className="h-5 w-5" />;

  if (lower.endsWith(".ts"))
    return <Icon icon="vscode-icons:file-type-typescript-official" className="h-5 w-5" />;

  if (lower.endsWith(".tsx"))
    return <Icon icon="vscode-icons:file-type-reactts" className="h-5 w-5" />;

  if (lower.endsWith(".jsx"))
    return <Icon icon="vscode-icons:file-type-reactjs" className="h-5 w-5" />;

  if (lower.endsWith(".json"))
    return <Icon icon="vscode-icons:file-type-json" className="h-5 w-5" />;

  if (lower.endsWith(".yml") || lower.endsWith(".yaml"))
    return <Icon icon="vscode-icons:file-type-light-yaml" className="h-5 w-5" />;

  if (lower === "dockerfile")
    return <Icon icon="vscode-icons:file-type-docker2" className="h-5 w-5" />;

  if (lower.endsWith(".sh"))
    return <Icon icon="vscode-icons:file-type-shell" className="h-5 w-5" />;

  if (lower.endsWith(".ps1"))
    return <Icon icon="vscode-icons:file-type-powershell" className="h-5 w-5" />;

  if (lower.endsWith(".html"))
    return <Icon icon="vscode-icons:file-type-html" className="h-5 w-5" />;

  if (lower.endsWith(".css"))
    return <Icon icon="vscode-icons:file-type-css" className="h-5 w-5" />;

  if (lower.endsWith(".png") ||
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".gif") ||
      lower.endsWith(".svg"))
    return <Icon icon="vscode-icons:file-type-image" className="h-5 w-5" />;

  if (lower.endsWith(".pdf"))
    return <Icon icon="vscode-icons:file-type-pdf2" className="h-5 w-5" />;

  if (lower.endsWith(".zip") ||
      lower.endsWith(".7z") ||
      lower.endsWith(".rar"))
    return <Icon icon="vscode-icons:file-type-zip" className="h-5 w-5" />;

  return <Icon icon="vscode-icons:default-file" className="h-5 w-5" />;
}