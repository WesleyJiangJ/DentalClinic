import { Document, Text, Page, StyleSheet, Image, View } from "@react-pdf/renderer";
import GeneralDentistry from "../../../../public/images/GeneralDentistry.jpeg"; // Asegúrate de que la ruta sea correcta

const styles = StyleSheet.create({
    page: {
        padding: 5,
        height: "100%",
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        fontFamily: "Helvetica",
    },
    section: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        height: "15%",
    },
    image: {
        width: "100%",
        height: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 10,
        marginBottom: 10,
        objectFit: "cover",
        borderRadius: 50,
        justifyContent: "center",
        backgroundColor: "yellow",
    },
    title: {
        width: "50%",
        display: "column",
        justifyContent: "center",
        height: "100%",
    },
    table: {
        display: "table",
        width: "100%",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#ddd",
        marginTop: 20,
        borderRadius: 5,
        overflow: "hidden",
    },
    tableRow: {
        flexDirection: "row",
    },
    tableCol: {
        flex: 1,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 5,
        backgroundColor: "#f9f9f9",
    },
    tableHeaderCol: {
        flex: 1,
        backgroundColor: "#4CAF50",
        color: "#fff",
        fontWeight: "bold",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 5,
    },
    tableCell: {
        textAlign: "center",
        fontSize: 10,
        color: "#333",
    },
    tableHeaderCell: {
        textAlign: "center",
        fontSize: 12,
        fontWeight: "bold",
    },
});

const headerMap = {
    created_at: "Fecha de Creación",
    description: "Decripción",
    first_name: "Nombre",
    first_lastname: "Apellido",
    totalPaid: "Pagado",
    totalSlope: "Deuda",
    total: "Total"
};

export const Pdf = ({ data }) => {
    const headers = data && data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.section}>
                    <View style={styles.title}>
                        <Text style={{ textAlign: "center", fontFamily: "Helvetica-Bold" }}>
                            Clínica Dental Integral
                        </Text>
                    </View>
                    <View style={{ width: "50%", backgroundColor: "#f0e5e4", borderRadius: 5 }}>
                        <Image src={GeneralDentistry} style={styles.image} />
                    </View>
                </View>
                <View style={{ width: "100%", height: "100%" }}>
                    <Text style={{ textAlign: "center" }}>Reporte</Text>
                    <View style={styles.table}>
                        {headers.length > 0 && (
                            <View style={styles.tableRow}>
                                {headers.map((header, index) => (
                                    <View style={styles.tableHeaderCol} key={index}>
                                        <Text style={styles.tableHeaderCell}>
                                            {headerMap[header] || header}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                        {data && data.length > 0 && data.map((row, rowIndex) => (
                            <View style={styles.tableRow} key={rowIndex}>
                                {headers.map((header, colIndex) => (
                                    <View style={styles.tableCol} key={colIndex}>
                                        <Text style={styles.tableCell}>
                                            {row[header] !== undefined ? row[header] : "-"}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
            </Page>
        </Document>
    );
};
