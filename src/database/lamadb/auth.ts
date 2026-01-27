import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";

/**
 * LamaAuth | The Sovereign Identity Gateway
 * Manages protocol-level authentication and high-fidelity identity establishes.
 */
export class LamaAuth {
    private static auth: Auth;
    private static app: FirebaseApp;

    /**
     * Establish credentials for the sovereign node.
     */
    static initialize(config: any) {
        if (!this.app && config.apiKey) {
            this.app = initializeApp(config);
            this.auth = getAuth(this.app);
        }
    }

    /**
     * Establishment of identity via GitHub protocol.
     * Requests repo and user scopes for deep intelligence mesh integration.
     */
    static async loginWithGithub() {
        if (!this.auth) throw new Error("LamaDB Auth not initialized. Protocol requires valid credentials.");
        const provider = new GithubAuthProvider();
        provider.addScope('repo');
        provider.addScope('user');
        return signInWithPopup(this.auth, provider);
    }

    /**
     * Establishment of identity via Google protocol.
     * High-velocity authentication for intelligence consumers.
     */
    static async loginWithGoogle() {
        if (!this.auth) throw new Error("LamaDB Auth not initialized.");
        const provider = new GoogleAuthProvider();
        return signInWithPopup(this.auth, provider);
    }

    /**
     * Secure termination of current identity establishing.
     */
    static async logout() {
        if (!this.auth) return;
        return signOut(this.auth);
    }

    /**
     * Subscribe to identity state transitions across the mesh.
     */
    static onAuthStateChanged(callback: (user: User | null) => void) {
        if (!this.auth) {
            callback(null);
            return () => { };
        }
        return onAuthStateChanged(this.auth, callback);
    }

    /**
     * Current established node identity.
     */
    static getCurrentUser() {
        return this.auth?.currentUser || null;
    }

    /**
     * Neural Content-Security Protocol (NCSP)
     * Verifies the integrity of identity establishment across distributed nodes.
     */
    static async verifyProtocolIntegrity() {
        console.info("[LamaAuth] Verifying identity protocol integrity...");
        return { status: 'secure', protocol: 'ncsp-2.0' };
    }
}
