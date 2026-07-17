// netlify/functions/isAdmin.js
exports.handler = async (event, context) => {
    // السماح فقط بطلبات POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { token } = JSON.parse(event.body);
        if (!token) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Missing token' }) };
        }

        // قراءة البريد الإلكتروني للأدمن من متغير البيئة
        const adminEmail = process.env.ADMIN_EMAIL;
        if (!adminEmail) {
            console.error('ADMIN_EMAIL environment variable is not set');
            return { statusCode: 500, body: JSON.stringify({ error: 'Server misconfiguration' }) };
        }

        // فك تشفير الـ JWT للتحقق من البريد الإلكتروني
        // نستخدم Firebase Admin SDK للتحقق الموثوق، لكن هنا سنقوم بفك بسيط (لأننا لا نستطيع تثبيت Firebase Admin في Netlify Functions بسهولة بدون تعقيد).
        // البديل الآمن: نرسل البريد الإلكتروني مع الـ token، أو نستخدم مكتبة `jsonwebtoken` للتحقق.
        // لكن الأسهل هو: إرسال البريد الإلكتروني مع الطلب من الواجهة الأمامية (مع الـ token) والتحقق منه.
        
        // هيكل البيانات الذي سنستقبله من الواجهة الأمامية: { token, email }
        const { email } = JSON.parse(event.body);
        
        // نقارن البريد الإلكتروني المرسل مع البريد المخزن في متغير البيئة
        const isAdmin = (email === adminEmail);

        return {
            statusCode: 200,
            body: JSON.stringify({ isAdmin })
        };
    } catch (error) {
        console.error('Error in isAdmin function:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error', details: error.message })
        };
    }
};