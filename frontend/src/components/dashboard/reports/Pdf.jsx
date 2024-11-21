import { Document, Text, Page, StyleSheet, Image, View } from '@react-pdf/renderer';
import GeneralDentistry from "../../../../public/images/GeneralDentistry.jpeg"; // Ensure the path is correct

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#E4E4E4",
        padding: 20, 
    },
    section: {
        display: "flex",
        flexDirection: "row",
        margin: 10,
        padding: 10,
        flexGrow: 1,
        alignItems: "center", 
    },
    text: {
        flex: 1,
        marginRight: 10, 
    },
    image: {
        width: 100, 
        height: 100, 
    },
    title: {
        fontSize: 24,
        textAlign: "center",
        fontWeight: "bold"
    }
});

export const Pdf = () => {
    return (
        <Document>
            <Page style={styles.page}>
                <Text style={styles.title}>Hola Mundo</Text>
                <View style={styles.section}>
                    <Text style={styles.text}>
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minus impedit voluptatum cum sapiente quidem doloremque eveniet, ut suscipit, ipsam quae quod vitae itaque ratione voluptate aliquam odit aperiam earum ex!
                    </Text>
                    <Image src={GeneralDentistry} style={styles.image} />
                </View>
                <View style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)' }}>
                    <Text render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`} />
                </View>


            </Page>
        </Document>
    );
};
