# Guiones narrados (texto exacto enviado a ElevenLabs). Cada bloque = una escena.
SCRIPTS = {
"planetas": [
 "Si te soltaran ahora mismo en cada planeta del sistema solar, en uno de ellos no durarías ni un segundo.",
 "Mercurio. De día, cuatrocientos treinta grados. De noche, ciento ochenta bajo cero. Sin traje, aguantarías un par de minutos.",
 "Venus. Cuatrocientos sesenta y cinco grados y una presión noventa veces mayor que la de la Tierra. Te aplastaría y te cocinaría casi al instante.",
 "Marte parece amable. Pero sin oxígeno, en quince segundos pierdes el conocimiento.",
 "Júpiter no tiene suelo. Caerías durante horas hasta que la presión te aplastara.",
 "Saturno, igual. Pero con vientos de mil ochocientos kilómetros por hora.",
 "Urano y Neptuno. Más de doscientos grados bajo cero. No pasarías del minuto.",
 "¿Y la Tierra? Aquí aguantas unos ochenta años. Dime en comentarios en qué planeta durarías más, y sígueme. Porque si te soltaran ahora mismo en cada planeta…",
],
"prohibidos": [
 "Hay un lugar en la Tierra donde, si pisas la playa, probablemente no salgas vivo. Y nadie irá a buscarte.",
 "Uno. Isla Sentinel del Norte, en la India. Se cree que su tribu lleva hasta sesenta mil años aislada.",
 "Acercarte a menos de cinco millas náuticas es ilegal. En dos mil dieciocho, un misionero lo intentó. No volvió.",
 "Dos. Isla de la Quemada Grande, en Brasil. Miles de serpientes cabeza de lanza dorada, con un veneno que puede necrosar la carne.",
 "Solo la Marina brasileña y algunos científicos pueden pisarla.",
 "Tres. Área cincuenta y uno, en Nevada. Los carteles lo dicen claro: uso de fuerza letal autorizado.",
 "Estados Unidos negó oficialmente su existencia hasta dos mil trece. Ni drones, ni fotos. Lo vigilan cámaras, sensores y patrullas.",
 "¿A cuál entrarías tú? Te leo en comentarios. Y sígueme, porque hay un lugar en la Tierra donde, si pisas la playa…",
],
"envidia": [
 "La persona que más te envidia probablemente te sonríe todos los días. Y hay tres señales que la delatan.",
 "Uno. Minimiza tus logros. Consigues algo y te dice: bueno, tuviste suerte.",
 "Dos. Te copia en silencio. Tu ropa, tus ideas, tus planes. Pero nunca te lo reconoce.",
 "Tres. Aparece más cuando te va mal que cuando te va bien.",
 "La psicología lo llama schadenfreude: alegrarse del mal ajeno. Y los estudios lo relacionan directamente con la envidia.",
 "Qué hacer: no cuentes tus planes antes de tiempo. Fíjate en las reacciones, no en las palabras. Y no compitas: aléjate con elegancia. Celebra tus logros con quien los celebra contigo.",
 "Escribe un uno si ya sabes quién es. Y sígueme, porque la persona que más te envidia…",
],
"roma": [
 "En la antigua Roma había un castigo tan cruel que te metían en un saco… con cuatro animales vivos.",
 "Se llamaba poena cullei. Para quien mataba a su padre.",
 "Te azotaban, te cosían en un saco de cuero con un perro, un gallo, una serpiente y un mono. Y al río.",
 "Segundo. La decimación. Si una legión huía, la dividían en grupos de diez.",
 "Uno de cada diez, elegido al azar, moría a palos a manos de sus propios compañeros. Craso lo hizo durante la rebelión de Espartaco.",
 "Tercero. Las vírgenes vestales. Si rompían su voto, las enterraban vivas, con algo de pan, agua y una lámpara.",
 "Así nadie manchaba sus manos con su sangre.",
 "¿Cuál te parece peor? Comenta. Y sígueme, porque en la antigua Roma había un castigo tan cruel…",
],
"sinhumanos": [
 "Si todos los humanos desapareciéramos hoy, en menos de dos días la Tierra se quedaría a oscuras.",
 "Sin nadie que las controle, las centrales eléctricas se apagan solas.",
 "En días, el metro de Nueva York se inunda. Las bombas de agua dejan de funcionar.",
 "En veinte años, las calles son bosques. Chernóbil ya lo demuestra: lobos, ciervos y caballos salvajes viven donde antes había ciudades.",
 "En cien años, la mayoría de casas se derrumban. Las raíces rompen el asfalto y el hormigón.",
 "En trescientos, caen los grandes puentes.",
 "Lo último en desaparecer: el plástico… y nuestras señales de radio, viajando por el espacio para siempre.",
 "¿Qué crees que quedaría al final? Comenta, y sígueme. Porque si todos los humanos desapareciéramos hoy…",
],
}
if __name__ == "__main__":
    tot=0
    for k,v in SCRIPTS.items():
        n=len(" ".join(v)); tot+=n; print(k,n)
    print("total",tot)
