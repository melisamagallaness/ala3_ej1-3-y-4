EJERCICIO 1
1. Generalización simbólica: ¿Cuáles son las reglas escritas del lenguaje?

    Mecanismo de delegación prototípica (Prototype Chain): Todo objeto posee un enlace interno ([[Prototype]]). Si se invoca o accede a una propiedad que no existe directamente en el objeto (own property), el motor busca de forma ascendente y recursiva a lo largo de la cadena de prototipos hasta encontrarla o llegar a null (devolviendo undefined).

    Vinculación dinámica del contexto (this): En una invocación a un método (objeto.metodo()), el identificador this se enlaza en tiempo de ejecución al objeto que realiza la llamada (el receptor), independientemente de en qué eslabón de la cadena de prototipos esté definido el método.

    Mecanismo de instanciación con new: Toda función tradicional posee la propiedad .prototype. La invocación new Constructor() sigue una secuencia formal estricta: crea un nuevo objeto en memoria, enlaza su prototipo interno a Constructor.prototype, y ejecuta la función asignando this a ese nuevo objeto.

    Creación directa con Object.create(): Permite instanciar un objeto vinculándolo explícitamente a otro que actúa como su prototipo directo, sin intermediación de una función constructora.

    Mutabilidad dinámica de estructuras: Los prototipos son objetos modificables en tiempo de ejecución. Agregar, modificar o eliminar miembros en un prototipo altera de forma inmediata el comportamiento de todas las instancias que delegan en él.

2. Creencias de los profesionales: ¿Qué características particulares del lenguaje se cree que sean "mejores" que en otros lenguajes?

    Eliminación de la dualidad artificial Clase vs. Instancia: Se considera superior que no existan moldes abstractos previos en tiempo de compilación. Todo lo que existe en memoria es un objeto real y concreto, lo que permite modelar entidades a partir de ejemplos vivos (prototipos) y no de abstracciones rígidas.

    Composición y flexibilidad frente a la herencia rígida: Evita las jerarquías estáticas profundas y el problema de la "clase base frágil". Se cree que favorece de forma mucho más natural el principio de "composición sobre herencia" mediante técnicas como mixins y delegación diferencial.

    Eficiencia en memoria por delegación compartida: A diferencia de sistemas que copian métodos o duplican estructuras, la delegación prototípica asegura que múltiples objetos compartan una única referencia a sus métodos en memoria sin requerir la sobrecarga de tablas de despacho virtual estáticas (vtables).

    Adaptabilidad y metaprogramación en tiempo de ejecución: Se valora la capacidad de modificar, extender o adaptar el comportamiento de los objetos dinámicamente (duck typing y extensión en caliente), considerándolo más ágil y expresivo para arquitecturas dinámicas que el tipado nominal y estricto de otros lenguajes.

EJERCICIO 4
1. ¿Qué características de la OOP usé en el ejercicio?

Abstracción:
Básicamente definí qué es una "Tarea" en el programa, quedándome solo con lo importante: título, descripción, dificultad, estado y fechas. En vez de andar pasando variables sueltas por todos lados, armé un molde único (Tarea) que representa esa idea en el código.

Encapsulamiento:
Antes tenía los datos por un lado (en objetos planos { ... }) y las funciones por otro, teniendo que armar a mano los cartelitos de "Pendiente" o las estrellitas de dificultad en cada archivo. Ahora junté los datos con su comportamiento.

    Ejemplo: El método mostrarDetalle() o actualizarEdicion() están metidos directamente en la tarea. Si tengo que cambiar cómo se ve una tarea o cómo se guarda la fecha de edición, lo cambio ahí adentro y no tengo que tocar ni buscarTareas.js ni mostrarTareas.js.

Prototipos y Delegación (el equivalente a las Clases/Instanciación):
Como la consigna pedía POO basada en prototipos (sin usar class), usé una función constructora function Tarea(...) y le colgué las funciones a su .prototype.

    Ejemplo: Al hacer new Tarea(...) en agregarTareas.js, se crea un objeto nuevo. Lo bueno de los prototipos es que métodos como mostrarDetalle() no se copian una y otra vez en la memoria por cada tarea que creo, sino que todas las tareas van a buscar y comparten esa misma función desde el prototipo.

2. ¿Cuáles no usé y por qué?

Herencia:
No la usé porque en el programa todas las tareas son iguales. No me pedían tener "TareaUrgente" o "TareaConRecordatorio" que heredaran de una tarea base. Era un solo tipo de tarea común y corriente, así que meter herencia entre prototipos (Object.create) hubiera sido complicar el código al vicio sin necesidad.

Polimorfismo:
Tampoco fue necesario porque no tengo objetos distintos que respondan de forma diferente al mismo mensaje. Si tuviera distintos tipos de tareas donde cada una se muestra o se calcula distinto, ahí sí aplicaría polimorfismo llamando a .mostrar() y dejando que cada una resuelva a su manera. Pero acá todas hacen exactamente lo mismo.