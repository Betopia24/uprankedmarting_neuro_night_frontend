type KnowledgeBaseFile = {
  knowledgeBaseId: string;
  knowledgeBaseName: string;
  fileName: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  knowledgeBaseList: KnowledgeBaseFile[];
};

export default async function KnowledgeBaseFiles({ knowledgeBaseList }: Props) {
  return (
    <div>
      {knowledgeBaseList.map((knowledgeBase) => (
        <div key={knowledgeBase.knowledgeBaseId}>{knowledgeBase.fileName}</div>
      ))}
    </div>
  );
}
