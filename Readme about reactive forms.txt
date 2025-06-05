السلام عليكم ورحمة الله وبركاته،
في البوست ده هنتكلم عن النوع التاني من أنواع الـ Forms في Angular، وهو:

Reactive Forms (Model-driven forms – two-way binding manually)
Reactive Forms بتعتمد على الكود بشكل أكبر، وبتديك تحكم كامل في كل جزء في الفورم من خلال الكومبوننت، وده بيخليها مناسبة أكتر للمشاريع المتوسطة والكبيرة أو أي حالة فيها Complex Validation أو Complex logic.

لازم نعمل import لـ ReactiveFormsModule في الموديول الرئيسي أو الموديول اللي فيه الفورم:
import { ReactiveFormsModule } from '@angular/forms';

بيتم إنشاء الفورم عن طريق كلاس FormGroup اللي بيحتوي على مجموعة من FormControls.
form = new FormGroup({
  email: new FormControl('', [Validators.required, Validators.email]),
  password: new FormControl('', Validators.required)
});

كل عنصر في الفورم بيتعبّر عنه بكائن FormControl، وتقدر تضيف عليه Validators حسب الحاجة.

استخدامه في الـ Template:
لازم تربط الـ form نفسه بالـ formGroup directive، وتربط كل input بـ formControlName.مهم جدًا:

تستخدم [formGroup] على عنصر الـ <form>

كل <input> لازم يكون عليه formControlName

تقدر توصل لقيمة معينة أو تتحقق من صلاحيتها كالتالي:
this.form.get('email')?.value
this.form.get('email')?.valid
this.form.get('email')?.errors

استخدام الـ Validators:
الـ Validators عبارة عن دوال Angular بتقدمها للتحقق من القيم، زي:

Validators.required

Validators.email

Validators.minLength(n)

Validators.maxLength(n)

تقدر كمان تكتب Validators مخصصة أو تستخدم Async Validators لو بتتحقق من قيمة في الـ backend (زي التأكد من إن الـ email مش موجود قبل كده).

FormArray:
لو محتاج تتعامل مع مجموعة عناصر بنفس التركيب (زي List من أرقام التليفونات)، تقدر تستخدم FormArray:
phones = new FormArray([
  new FormControl(''),
  new FormControl('')
]);

بعض الخصائص المهمة في FormControl أو FormGroup:
value: القيمة الحالية

valid: هل البيانات صالحة

invalid: هل البيانات غير صالحة

touched: المستخدم لمس الحقل

dirty: المستخدم غيّر القيمة

errors: بيحتوي على تفاصيل الأخطاء


الفرق الأساسي عن Template Driven Forms:
Reactive Forms بتبني الـ structure كامل بالكود.

عندك تحكم كامل في كل خاصية وكل خطوة في عملية التحقق من البيانات.

أسهل في التستينج، وأكثر مرونة في التعامل مع المنطق المعقد.

ملحوظة:
دايمًا تأكد إنك حاطط formGroup في الـ form و formControlName على كل input، لأن نسيانهم بيؤدي لأخطاء في ربط البيانات، وممكن تلاقي القيم بـ undefined أو يحصل submit من غير بيانات.

الخلاصة:

Reactive Forms تعتبر الأنسب في حالات:

المشاريع الكبيرة

التعامل مع بيانات معقدة

التحقق من البيانات بطريقة مخصصة

إعادة استخدام الفورم أو أجزاء منه

تحتاج شوية كود أكتر من Template Driven Forms، لكن هتديك مرونة كبيرة وتحكم أفضل في الـ validation وسلوك الـ form.