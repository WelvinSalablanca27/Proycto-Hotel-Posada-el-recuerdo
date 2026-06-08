import { Container, Card } from "react-bootstrap";

const Dashboard = () => {
  return (
    <Container>
      <br />

      <Card style={{ height: "600px" }}>
        <iframe
          title="estadisticas"
          width="100%"
          height="100%"
          src="https://app.powerbi.com/view?r=eyJrIjoiOGNiNmM5NGEtOTFiYS00NDBlLWJjNTItY2ZlNmM0OTk0MDVhIiwidCI6ImU0NzY0NmZlLWRhMjctNDUxOC04NDM2LTVmOGIxNThiYTEyNyIsImMiOjR9"
          allowFullScreen
          style={{ border: "none" }}
        />
      </Card>
    </Container>
  );
};

export default Dashboard;