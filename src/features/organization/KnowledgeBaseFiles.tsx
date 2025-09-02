type KnowledgeBase = {
  knowledgeBaseId: string;
  knowledgeBaseName: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  files: KnowledgeBase[];
};

export default function KnowledgeBaseList({ files }: Props) {
  return (
    <div>
      {files.map((file) => (
        <div key={file.knowledgeBaseId}>{file.fileName}</div>
      ))}
    </div>
  );
}
