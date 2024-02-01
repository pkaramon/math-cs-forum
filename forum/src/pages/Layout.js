import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import React from "react";

function Layout() {
  const theme = useTheme();

  console.log(theme.mixins.toolbar);
  console.log(theme.breakpoints.up("xs"));
  console.log(theme.breakpoints.up("sm"));
  console.log(theme.mixins.toolbar[theme.breakpoints.up("xs")].minHeight);
  console.log(theme.mixins.toolbar[theme.breakpoints.up("sm")].minHeight);
  const mainBoxStyles = {
    width: "100%",
    marginTop: { md: 8, sm: 3 }, // Default AppBar height for Material UI
    // [theme.breakpoints.up("xs")]: {
    //   marginTop: `56px`, // AppBar height on extra small screens
    // },
    // [theme.breakpoints.up("sm")]: {
    //   marginTop: `64px`, // AppBar height on small screens and up
    // },
  };

  return (
    <>
      <Navbar />
      <Box component="main" sx={mainBoxStyles}>
        <Outlet />
      </Box>

      <div>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda
        excepturi fuga modi mollitia nihil, numquam, officia pariatur provident
        quidem repellat saepe temporibus. Asperiores, at debitis deserunt dicta
        eius excepturi exercitationem, itaque magni maiores minima minus
        mollitia non odit quae quo recusandae saepe suscipit totam velit
        veritatis? Aliquid architecto aspernatur corporis debitis doloribus
        eveniet fugiat nemo quae quia recusandae repudiandae, voluptate.
        Asperiores corporis explicabo nemo nihil reprehenderit sed vel! Adipisci
        amet earum inventore magnam minus quam rem vel! Explicabo in maxime
        officia quis sit sunt veniam, voluptas. A alias, aperiam consequatur
        delectus doloremque ducimus error, et ipsam itaque quaerat quidem quos
        reiciendis repudiandae saepe sapiente similique tenetur voluptatibus!
        Accusamus adipisci aliquam, amet animi asperiores aut deserunt dicta
        distinctio doloremque dolorum earum error est facere facilis hic minima
        necessitatibus nulla obcaecati officia porro quo reiciendis repellendus
        sapiente sequi similique sit soluta temporibus tenetur vitae voluptates.
        Accusantium corporis ex exercitationem expedita nulla quibusdam
        recusandae repudiandae sint tenetur velit. Earum id laboriosam mollitia
        possimus quia, tempore velit voluptates. Aliquam atque beatae culpa cum
        cumque deserunt dolor doloremque ea eveniet in, ipsa molestiae mollitia
        necessitatibus nemo nobis optio placeat porro praesentium qui, quod
        repudiandae sint sit velit. A accusamus, adipisci, amet architecto
        asperiores atque delectus dicta doloremque ea esse et excepturi
        explicabo facere fuga hic illo impedit incidunt inventore ipsam iste
        laboriosam laudantium molestiae mollitia nisi obcaecati perferendis
        perspiciatis possimus quam qui quia quibusdam quidem quod, repudiandae
        saepe vel velit voluptatem. A aut deserunt dignissimos minus mollitia,
        quis sequi similique totam. A ad adipisci aliquid atque cum dignissimos
        dolore doloremque ea eius eos error facere ipsa labore maiores minus
        molestias mollitia necessitatibus nihil nulla obcaecati odio officia
        omnis provident quia quibusdam quidem quod reiciendis rem repellat,
        saepe sint temporibus, vel vitae voluptate voluptatem voluptates
        voluptatibus. Aliquam consequatur culpa cumque, debitis deserunt
        dignissimos dolor doloremque error excepturi ipsa labore magnam maxime
        minus modi, molestias mollitia officia officiis pariatur provident quia
        quidem rem sed veniam. Aperiam consequatur culpa cum debitis deserunt
        dolores eum fuga fugit nulla obcaecati, officiis optio, placeat rerum
        sit suscipit vero, vitae. A accusamus aliquam animi architecto
        asperiores blanditiis commodi corporis cum delectus dignissimos dolorem
        dolorum eius esse excepturi facere fuga harum id impedit laboriosam
        laborum laudantium magni minus modi nam, nihil nisi perspiciatis
        provident quam quidem quo ratione sequi sit tempora ullam voluptates
        voluptatibus voluptatum. Adipisci aspernatur at beatae cumque delectus
        dolore, eius enim eos excepturi facilis itaque laboriosam laborum
        maxime, nostrum nulla obcaecati officia provident qui quia quis quisquam
        rem reprehenderit sint, suscipit tempore voluptas voluptatum. Ab
        architecto atque deserunt dignissimos eaque eligendi enim, in, ipsum
        laudantium perferendis praesentium reiciendis, suscipit vero? Amet,
        assumenda deleniti dolor explicabo harum minus molestiae molestias
        quisquam quos recusandae, repudiandae rerum tempora unde ut
        voluptatibus. Amet atque autem blanditiis, consectetur consequatur culpa
        eius est et ex fuga, fugit ipsam libero magni molestias provident soluta
        ullam unde voluptatem! Accusamus architecto, commodi consectetur
        corporis deserunt dolor earum error esse explicabo fugit illum incidunt
        iure, nemo omnis porro provident quaerat repudiandae similique veniam
        voluptate. Aliquam animi asperiores aut consectetur cum dolorem earum
        enim error fugit harum ipsam laborum magnam, molestias nam numquam odit
        perferendis perspiciatis quaerat quia quibusdam quis quod quos sapiente
        sequi tempora vitae voluptates. Cum deleniti dolorum laudantium maxime
        molestiae? Ex ipsam molestias ratione? Ab et molestiae repellendus
        reprehenderit vitae. Adipisci aspernatur consequuntur corporis culpa
        cumque ducimus eaque et eum harum hic illo iste labore maxime minima
        minus nihil nulla numquam obcaecati odio odit perspiciatis porro quidem
        quisquam, reiciendis repudiandae ut velit voluptate. Adipisci amet
        architecto delectus deleniti quidem. Blanditiis expedita incidunt ipsa
        ratione voluptatum. Architecto autem beatae delectus, facilis maxime
        pariatur quam voluptatibus? Accusamus accusantium commodi consectetur
        consequatur deleniti doloremque ea, eveniet ex fugiat ipsa ipsum magnam
        maxime molestias non nostrum pariatur placeat quaerat quasi qui quo
        soluta sunt tenetur totam ut vel? Assumenda aut dicta neque nesciunt
        repellendus velit vero voluptas. Eius inventore nostrum quos sapiente
        voluptatum! Consectetur consequuntur cum debitis eligendi eos laborum
        libero officiis quos repellat voluptas! Alias amet blanditiis
        consectetur error est et excepturi impedit, iste labore magni maiores,
        modi provident qui quos rerum ullam velit voluptatum. Culpa facilis,
        magni nulla quisquam sapiente sequi tempore? Dicta incidunt ipsa ipsam,
        laborum minima reprehenderit similique tenetur. A autem culpa, delectus
        dolore explicabo facilis hic impedit in ipsum itaque labore laborum
        molestias nemo non, officia possimus quibusdam ratione rem repellat
        reprehenderit sapiente sit suscipit ut. Aliquam est ipsum laborum quis.
        Ab assumenda at, atque deleniti deserunt ea eaque eligendi et ex
        excepturi exercitationem ipsum labore laboriosam libero magni molestiae
        natus nemo nisi obcaecati odit omnis quas ratione repellendus sequi sint
        sunt tempore voluptatibus. Accusamus accusantium amet at doloribus
        eligendi, optio quia quis ratione. Commodi, consequatur delectus dolorem
        eos, error ex facere impedit ipsam maiores numquam obcaecati, omnis quae
        quia reprehenderit soluta. Aspernatur at corporis deleniti, dolorem
        doloremque eum iure laborum molestias quaerat, quos reprehenderit
        voluptas voluptatibus. Ad adipisci animi aperiam blanditiis, corporis
        debitis deserunt dignissimos eligendi eum facere fuga inventore iusto
        numquam, qui quos reiciendis sapiente soluta ullam. Architecto cumque
        ducimus et, ipsam iste labore natus nemo optio placeat quisquam
        reprehenderit saepe tempore ut, voluptas voluptatum. A adipisci, aliquid
        architecto blanditiis consequatur consequuntur dignissimos, distinctio
        dolor eius, enim error exercitationem illum ipsam ipsum iure maiores
        mollitia nostrum officia quas qui quo repellat sint. Accusamus
        accusantium atque autem doloribus exercitationem illo illum ipsa labore
        magni odio placeat, quae quas quis recusandae soluta unde ut. Aut,
        commodi in incidunt inventore quaerat qui quia veritatis. A aliquid
        architecto at atque, aut autem blanditiis consequuntur corporis, cumque
        cupiditate deserunt distinctio dolores ducimus ex explicabo laborum
        libero molestias, nobis non quas quia quibusdam quo rem repellendus
        rerum sint vel veniam vitae voluptas voluptatibus. Accusantium animi
        aperiam asperiores assumenda commodi consectetur cum dolor doloremque
        dolorum eius eos esse expedita hic minima molestiae porro quam quo
        ratione, repellendus repudiandae saepe sequi, soluta, ut velit veniam
        voluptas voluptate voluptatibus. Autem dolor eaque est, id ipsa quasi
        quibusdam vel. Consequatur dignissimos hic maxime minima, necessitatibus
        quisquam ratione repudiandae sit tempora. Beatae et, exercitationem nemo
        possimus qui quidem quisquam recusandae repudiandae vitae? Commodi
        fugiat molestias soluta.
      </div>
    </>
  );
}

export default Layout;
