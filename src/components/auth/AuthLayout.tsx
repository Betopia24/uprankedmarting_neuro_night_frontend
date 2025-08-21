import Container from "../Container";

export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <Container>
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="flex-1 basis-1/2"></div>
        <div className="flex-1">{children}</div>
      </div>
    </Container>
  );
}
