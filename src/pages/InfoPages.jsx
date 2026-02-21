import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Info } from 'lucide-react';

const InfoPageLayout = ({ title, icon: Icon, children }) => {
    const navigate = useNavigate();
    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-app)', paddingBottom: '40px' }}>
            <div style={{
                position: 'sticky', top: 0, zIndex: 10,
                backgroundColor: 'var(--bg-card)', padding: '20px',
                display: 'flex', alignItems: 'center', gap: '16px',
                borderBottom: '1px solid var(--border-light)'
            }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: '8px', borderRadius: '50%',
                        backgroundColor: 'var(--bg-app)',
                        border: '1px solid var(--border-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-main)'
                    }}
                >
                    <ArrowLeft size={20} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {Icon && <Icon size={20} color="var(--primary)" />}
                    <h1 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>{title}</h1>
                </div>
            </div>
            <div className="container" style={{ padding: '24px 20px' }}>
                <div style={{
                    backgroundColor: 'var(--bg-card)', borderRadius: '16px', padding: '24px',
                    boxShadow: 'var(--shadow-sm)', color: 'var(--text-main)', lineHeight: '1.6'
                }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export const Privacy = () => (
    <InfoPageLayout title="Gizlilik ve Güvenlik" icon={Shield}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>Verileriniz Bizimle Güvende</h3>
        <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
            Mutfağın Şefi olarak gizliliğinize önem veriyoruz. Bu uygulama, kişisel verilerinizi <strong>sadece cihazınızda (LocalStorage)</strong> saklayacak şekilde tasarlanmıştır.
        </p>

        <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Hangi Verileri Topluyoruz?</h4>
        <ul style={{ paddingLeft: '20px', marginBottom: '16px', color: 'var(--text-secondary)' }}>
            <li style={{ marginBottom: '4px' }}>Favori tarifleriniz</li>
            <li style={{ marginBottom: '4px' }}>Pişirme geçmişiniz</li>
            <li style={{ marginBottom: '4px' }}>Yazdığınız yorumlar ve puanlar</li>
            <li style={{ marginBottom: '4px' }}>Profil bilgileriniz (İsim, Avatar vb.)</li>
        </ul>

        <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>Verileriniz Nasıl Kullanılıyor?</h4>
        <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
            Verileriniz yalnızca size daha iyi bir deneyim sunmak için kullanılır. Herhangi bir uzak sunucuya gönderilmez veya üçüncü taraflarla paylaşılmaz.
        </p>

        <div style={{ padding: '12px', backgroundColor: 'var(--tag-green-bg)', borderRadius: '12px', color: 'var(--tag-green-text)', fontSize: '14px', fontWeight: 600 }}>
            🔒 Hesabınız ve bilgileriniz tamamen sizin kontrolünüzdedir.
        </div>
    </InfoPageLayout>
);

export const Terms = () => (
    <InfoPageLayout title="Kullanım Koşulları" icon={FileText}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px', color: 'var(--text-main)' }}>Hoş Geldiniz!</h3>
        <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
            Mutfağın Şefi uygulamasını kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız. Amacımız yemek yapmayı herkes için keyifli hale getirmektir.
        </p>

        <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>1. Kullanım Kuralları</h4>
        <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
            Uygulamayı yasalara uygun bir şekilde kullanmalısınız. Topluluk kurallarına aykırı, hakaret içeren veya yanıltıcı içerik (yorumlar vb.) oluşturmak yasaktır.
        </p>

        <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>2. İçerik Sorumluluğu</h4>
        <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
            Uygulamadaki tarifler bilgilendirme amaçlıdır. Alerjen durumlarına ve diyet kısıtlamalarına karşı lütfen dikkatli olun. Oluşabilecek durumlardan kullanıcı sorumludur.
        </p>

        <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px', color: 'var(--text-main)' }}>3. Değişiklikler</h4>
        <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
            Mutfağın Şefi, bu koşulları dilediği zaman güncelleme hakkını saklı tutar.
        </p>
    </InfoPageLayout>
);

export const About = () => (
    <InfoPageLayout title="Hakkında" icon={Info}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
                width: '80px', height: '80px', backgroundColor: 'var(--primary)',
                borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontSize: '40px'
            }}>
                👨‍🍳
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>Mutfağın Şefi</h2>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>v1.0.2</div>
        </div>

        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>Misyonumuz</h3>
        <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
            Dünyanın her yerinden en lezzetli tarifleri, herkesin kolayca yapabileceği şekilde sunmak. Mutfağa girmeyi seven herkesin en iyi yardımcısı olmak.
        </p>

        <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px', color: 'var(--text-main)' }}>Geliştirici</h3>
        <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>
            Bu uygulama <strong>Mars Şef Ekibi</strong> tarafından sevgiyle geliştirilmiştir. <br /><br />
            Her türlü geri bildiriminiz için bizimle iletişime geçebilirsiniz.
        </p>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--text-caption)' }}>
            © 2026 Mutfağın Şefi. Tüm hakları saklıdır.
        </div>
    </InfoPageLayout>
);
